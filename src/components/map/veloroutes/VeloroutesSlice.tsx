import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import {
    setActiveSection,
    loadTrainroutesAlongVeloroute,
} from "../trainroutes/TrainroutesSlice";
import { makeVeloRoute } from "../../../utils/makeVeloRoute";
import type { AppDispatch, RootState } from "../../../store";

export type ResponseStop = {
    id: string;
    name: string;
    dest_name: string;
    dist: number;
    lat: string;
    lon: string;
    stop_number: number;
    trainlines?: string; // comma separated string of trainline_ids from API
    trainstop?: string;
    veloroute_id: string;
};

export type VelorouteStop = {
    stop_id: string;
    stop_name: string;
    trainlines?: string[];
    trainstop?: string;
    x: number;
    y: number;
};

export type Veloroute = {
    id: string;
    name: string;
    len: number;
    route: {
        dist: number;
        leg: VelorouteStop[];
    }[];
    path: string[];
};
export interface VeloroutesState {
    velorouteList: Veloroute[];
    velorouteListIsLoading: boolean;
    crossingVelorouteList: Veloroute[];
    isLoading: boolean;
    hasError: boolean;
    crossingRoutesLoading: boolean;
    crossingRoutesError: boolean;
    activeVeloroute: Veloroute | null;
    activeVelorouteSection: number | null;
    hoveredVelorouteSection: number | null;
    activeVelorouteStop: VelorouteStop | null;
    crossingVelorouteSection?: number[];
}

export const loadVeloroutes = createAsyncThunk<
    Veloroute[],
    string[],
    { state: RootState }
>("veloroutes/setVelorouteList", async (ids: string[], thunkAPI) => {
    const veloroutesQuery = "veloroutes/ids[]=" + ids.join("&ids[]=");
    const velorouteStops: ResponseStop[] = await fetch(
        `${VITE_API_URL}${veloroutesQuery}`,
        {
            headers: headers,
        },
    ).then((response) => {
        if (response.status !== 200) {
            throw new Error("Bad Server Response");
        }
        return response.json();
    });

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;
    const stopsGroupedByRouteId = velorouteStops.reduce(
        (acc, stop) => {
            if (!acc[stop.veloroute_id]) {
                acc[stop.veloroute_id] = [];
            }
            acc[stop.veloroute_id].push(stop);
            return acc;
        },
        {} as Record<string, ResponseStop[]>,
    );

    return Object.values(stopsGroupedByRouteId).map((velorouteStops) =>
        makeVeloRoute(velorouteStops, trainlines),
    );
});

export const loadVeloroute = createAsyncThunk<
    Veloroute,
    Veloroute,
    { state: RootState }
>("veloroutes/setVeloroute", async (vroute: Veloroute, thunkAPI) => {
    const { id } = vroute;
    const velorouteQuery = "veloroute/" + id;
    const responseStops: ResponseStop[] = await fetch(
        `${VITE_API_URL}${velorouteQuery}`,
        {
            headers: headers,
        },
    ).then((response) => response.json());

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;

    return makeVeloRoute(responseStops, trainlines);
});

export const setVelorouteSectionActiveThunk = (idx: number) => {
    return (dispatch: AppDispatch) => {
        dispatch(setActiveVelorouteSection(idx));
        dispatch(setActiveSection(null));
        dispatch(loadTrainroutesAlongVeloroute(idx));
    };
};

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
        crossingVelorouteList: [],
        isLoading: false,
        hasError: false,
        crossingRoutesLoading: false,
        crossingRoutesError: false,
        activeVeloroute: null,
        activeVelorouteSection: null,
        hoveredVelorouteSection: null,
        activeVelorouteStop: null,
    } as VeloroutesState,
    reducers: {
        setActiveVeloroute: (state, action: { payload: Veloroute | null }) => {
            state.activeVeloroute = action.payload;
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
        setCrossingVelorouteSection: (state) => {
            state.crossingVelorouteSection = [];
        },
        setVelorouteList: (state, action: { payload: Veloroute[] }) => {
            state.velorouteList = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loadVeloroutes.pending, (state) => {
                state.velorouteListIsLoading = true;
                state.hasError = false;
            })
            .addCase(loadVeloroutes.fulfilled, (state, action) => {
                state.velorouteList = action.payload;
                state.velorouteListIsLoading = false;
                state.hasError = false;
            })
            .addCase(loadVeloroutes.rejected, (state) => {
                state.velorouteListIsLoading = false;
                state.hasError = true;
            })
            .addCase(loadVeloroute.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadVeloroute.fulfilled, (state, action) => {
                state.activeVeloroute = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(loadVeloroute.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
            });
    },
});

export const selectVelorouteList = (state: RootState) =>
    state.veloroutes.velorouteList;
export const selectCrossingVelorouteList = (state: RootState) =>
    state.veloroutes.crossingVelorouteList;
export const selectActiveVeloroute = (state: RootState) =>
    state.veloroutes.activeVeloroute;
export const selectActiveVelorouteSection = (state: RootState) =>
    state.veloroutes.activeVelorouteSection;
export const selectActiveVelorouteStop = (state: RootState) =>
    state.veloroutes.activeVelorouteStop;
export const selectVeloroutesLoading = (state: RootState) =>
    state.veloroutes.isLoading;
export const selectVelorouteListIsLoading = (state: RootState) =>
    state.veloroutes.velorouteListIsLoading;
export const selectCrossingVeloroutesLoading = (state: RootState) =>
    state.veloroutes.crossingRoutesLoading;
export const selectHoveredVelorouteSection = (state: RootState) =>
    state.veloroutes.hoveredVelorouteSection;

export const {
    setActiveVeloroute,
    setActiveVelorouteSection,
    setHoveredVelorouteSection,
    setActiveVelorouteStop,
    setCrossingVelorouteSection,
    setVelorouteList,
} = veloroutesSlice.actions;

export default veloroutesSlice.reducer;
