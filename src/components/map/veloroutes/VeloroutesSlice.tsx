import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import {
    setActiveSection,
    loadTrainroutesAlongVeloroute,
} from "../trainroutes/TrainroutesSlice";
import {
    convertVelorouteStops,
    makeVeloRoute,
    makeVelorouteLegs,
} from "../../../utils/makeVeloRoute";
import type { AppDispatch, RootState } from "../../../store";

export type VeloroutesResponseStop = {
    name: string;
    dest_name: string | null;
    dist: number;
    gcs: string;
    lat: string;
    lon: string;
    station_lat: string | null;
    station_lon: string | null;
    station_name: string;
    stop_number: number;
    trainlines: string; // comma separated string of trainline_ids from API
    trainstop: number | null;
    veloroute_id: string;
};

export type VelorouteStop = {
    stop_id: string;
    stop_name: string;
    trainlines?: string[];
    trainstop: number | null;
    x: number;
    y: number;
    lat: number;
    lon: number;
    distToTrainstation?: number;
    dist: number;
    path: string;
};

export type Veloroute = {
    id: string;
    name: string;
    len: number;
    route: {
        dist: number;
        leg: VelorouteStop[];
        path: string;
    }[];
};
export type VelorouteListItem = {
    id: string;
    name: string;
    len: number;
    gcs: string;
};

export const loadVeloroutes = createAsyncThunk<
    VelorouteListItem[],
    number[],
    { state: RootState }
>("veloroutes/setVelorouteList", async (trainstations: number[], thunkAPI) => {
    const state = thunkAPI.getState();
    const startPosId = state.trainroutes.startPos;

    const normalizedIds = Array.from(
        new Set(trainstations.filter((id) => !!id && id !== startPosId)),
    );

    if (normalizedIds.length === 0) {
        return [];
    }

    const veloroutes: VelorouteListItem[] = await fetch(
        `${VITE_API_URL}veloroutes`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ trainstations: normalizedIds }),
        },
    ).then((response) => {
        if (response.status !== 200) {
            throw new Error("Bad Server Response");
        }
        return response.json();
    });

    return veloroutes;
});

export const loadVeloroute = createAsyncThunk<
    Veloroute,
    { id: string },
    { state: RootState }
>("veloroutes/setVeloroute", async ({ id }, thunkAPI) => {
    const velorouteQuery = "veloroute/" + id;
    const responseStops: VeloroutesResponseStop[] = await fetch(
        `${VITE_API_URL}${velorouteQuery}`,
        {
            headers: headers,
        },
    ).then((response) => response.json());
    const trainstops = thunkAPI.getState().trainroutes.trainstops;
    const maxDistToNextStation =
        thunkAPI.getState().trainroutes.maxDistToNextStation;
    const velorouteStops = convertVelorouteStops(responseStops, trainstops);
    const activeVeloroute = makeVeloRoute(
        velorouteStops,
        maxDistToNextStation,
        id,
        responseStops[0].name,
    );
    return activeVeloroute;
});

export const setVelorouteSectionActiveThunk = (idx: number) => {
    return (dispatch: AppDispatch) => {
        dispatch(setActiveVelorouteSection(idx));
        dispatch(setActiveSection(null));
        dispatch(loadTrainroutesAlongVeloroute(idx));
    };
};

export interface VeloroutesState {
    velorouteList: VelorouteListItem[];
    velorouteListIsLoading: boolean;
    veloroute: Veloroute | null;
    activeVelorouteSection: number | null;
    hoveredVelorouteSection: number | null;
    activeVelorouteStop: VelorouteStop | null;
    velorouteIsLoading: boolean;
    velorouteHasError: boolean;
    veloroutesHasError: boolean;
    maxDistToNextStation: number;
}
/**
 * activeVeloroute
 * id: string,
 * name: string,
 * len: number,
 * route: { stop_id: string, stop_name: string, x: number, y: number, lat: number, lon: number }[][],
 * path: string
 */
export const veloroutesSlice = createSlice({
    name: "veloroutes",
    initialState: {
        velorouteList: [],
        velorouteListIsLoading: false,
        veloroutesHasError: false,
        veloroute: null,
        velorouteIsLoading: false,
        velorouteHasError: false,
        activeVelorouteSection: null,
        hoveredVelorouteSection: null,
        activeVelorouteStop: null,
        maxDistToNextStation: 2,
    } as VeloroutesState,
    reducers: {
        setActiveVeloroute: (
            state,
            action: { payload: { maxDistToNextStation: number } | null },
        ) => {
            if (action.payload === null || !state.veloroute) {
                state.veloroute = null;
                return;
            }
            state.velorouteIsLoading = true;
            state.activeVelorouteSection = null;
            const { maxDistToNextStation } = action.payload;
            state.maxDistToNextStation = maxDistToNextStation;
            // obtain original stops from legs by filtering out duplicates at leg joints
            const veloroutestops: VelorouteStop[] = state.veloroute.route
                .flatMap((s) => s.leg.map((stop) => stop))
                .filter((stop, idx, arr) =>
                    arr
                        .slice(0, idx)
                        .every((prevStop) => prevStop.stop_id !== stop.stop_id),
                );
            const legs = makeVelorouteLegs(
                veloroutestops,
                maxDistToNextStation,
            );
            state.veloroute = {
                ...state.veloroute,
                route: legs,
            };
            state.velorouteIsLoading = false;
        },
        setActiveVelorouteSection: (
            state,
            action: { payload: number | null },
        ) => {
            state.activeVelorouteSection = action.payload;
        },
        setHoveredVelorouteSection: (
            state,
            action: { payload: number | null },
        ) => {
            state.hoveredVelorouteSection = action.payload;
        },
        setActiveVelorouteStop: (
            state,
            action: { payload: VelorouteStop | null },
        ) => {
            state.activeVelorouteStop = action.payload;
        },
        setVelorouteList: (state, action: { payload: VelorouteListItem[] }) => {
            state.velorouteList = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loadVeloroutes.pending, (state) => {
                state.velorouteListIsLoading = true;
                state.veloroutesHasError = false;
            })
            .addCase(loadVeloroutes.fulfilled, (state, action) => {
                state.velorouteList = action.payload;
                state.velorouteListIsLoading = false;
                state.veloroutesHasError = false;
            })
            .addCase(loadVeloroutes.rejected, (state) => {
                state.velorouteListIsLoading = false;
                state.veloroutesHasError = true;
            })
            .addCase(loadVeloroute.pending, (state) => {
                state.velorouteIsLoading = true;
                state.velorouteHasError = false;
            })
            .addCase(loadVeloroute.fulfilled, (state, action) => {
                state.veloroute = { ...state.veloroute, ...action.payload };
                state.velorouteIsLoading = false;
                state.velorouteHasError = false;
            })
            .addCase(loadVeloroute.rejected, (state) => {
                state.velorouteIsLoading = false;
                state.velorouteHasError = true;
            });
    },
});

export const selectVelorouteList = (state: RootState) =>
    state.veloroutes.velorouteList;
export const selectActiveVeloroute = (state: RootState) =>
    state.veloroutes.veloroute;
export const selectActiveVelorouteSection = (state: RootState) =>
    state.veloroutes.activeVelorouteSection;
export const selectActiveVelorouteStop = (state: RootState) =>
    state.veloroutes.activeVelorouteStop;
export const selectVeloroutesLoading = (state: RootState) =>
    state.veloroutes.velorouteIsLoading ||
    state.veloroutes.velorouteListIsLoading;
export const selectHoveredVelorouteSection = (state: RootState) =>
    state.veloroutes.hoveredVelorouteSection;
export const selectMaxDistToNextStations = (state: RootState) =>
    state.veloroutes.maxDistToNextStation;

export const {
    setActiveVeloroute,
    setActiveVelorouteSection,
    setHoveredVelorouteSection,
    setActiveVelorouteStop,
    setVelorouteList,
} = veloroutesSlice.actions;

export default veloroutesSlice.reducer;
