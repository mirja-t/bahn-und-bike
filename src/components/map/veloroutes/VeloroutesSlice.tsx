import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import {
    setActiveSection,
    loadTrainroutesAlongVeloroute,
    type CurrentTrainroute,
} from "../trainroutes/TrainroutesSlice";
import { makeVeloRoute } from "../../../utils/makeVeloRoute";
import type { AppDispatch, RootState } from "../../../store";

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

export type VelorouteList = (Omit<Veloroute, "route" | "path"> & {
    trainRouteIds: string[];
})[];

export interface VeloroutesState {
    velorouteList: VelorouteList;
    velorouteListIsLoading: boolean;
    crossingVelorouteList: VelorouteList;
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
    VelorouteList,
    CurrentTrainroute[],
    { state: RootState }
>(
    "veloroutes/setVelorouteList",
    async (trainroutes: CurrentTrainroute[], thunkAPI) => {
        const startDestinations = thunkAPI.getState().trainroutes.startPos;

        const vroutes: {
            [id: string]: VelorouteList[number];
        } = {};
        for (const trainroute of trainroutes) {
            const activeIds = trainroute.stopIds.filter(
                (id) => id !== startDestinations,
            );
            const filteredActiveIds = activeIds.filter(
                (s) => !startDestinations.includes(s),
            );
            if (filteredActiveIds.length === 0) {
                continue;
            }
            const veloroutesQuery =
                "veloroutes/ids[]=" + filteredActiveIds.join("&ids[]=");
            const routeVeloroutes: VelorouteList = await fetch(
                `${VITE_API_URL}${veloroutesQuery}`,
                {
                    headers: headers,
                },
            ).then((response) => response.json());
            routeVeloroutes.forEach((vr) => {
                const currentVR = vroutes[vr.id] || {
                    ...vr,
                    trainRouteIds: [],
                };
                currentVR.id = vr.id;
                currentVR.name = vr.name;
                currentVR.len = vr.len;
                currentVR.trainRouteIds.push(trainroute.id);
                vroutes[vr.id] = currentVR;
            });
        }

        const veloroutes: VelorouteList = Object.values(vroutes);
        return veloroutes;
    },
);

export type ResponseStop = {
    id: string;
    dest_name: string;
    dist: number;
    lat: string;
    lon: string;
    stop_number: number;
    trainlines?: string; // comma separated string of trainline_ids from API
    trainstop?: string;
    veloroute_id: string;
};
export const loadVeloroute = createAsyncThunk<
    Veloroute,
    Veloroute,
    { state: RootState }
>("veloroutes/setVeloroute", async (vroute: Veloroute, thunkAPI) => {
    const { id, name } = vroute;
    const velorouteQuery = "veloroute/" + id;
    const responseStops: ResponseStop[] = await fetch(
        `${VITE_API_URL}${velorouteQuery}`,
        {
            headers: headers,
        },
    ).then((response) => response.json());

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;

    return makeVeloRoute(responseStops, name, trainlines);
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
} = veloroutesSlice.actions;

export default veloroutesSlice.reducer;
