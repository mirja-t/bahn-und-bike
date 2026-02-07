import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import { allocateVeloroutestopsToRoute } from '../../../utils/allocateVeloroutestopsToRoute';
import { headers, VITE_API_URL } from "../../../config/config";
//import { generateCrossingVeloroutes } from '../../../utils/generateCrossingVeloroutes';
import {
    setActiveSection,
    loadTrainroutesAlongVeloroute,
} from "../trainroutes/TrainroutesSlice";
//import { refactorStopData } from '../../../utils/refactorStopData';
import { getRoutePath } from "../../../utils/getRoutePath";
import { addXYValues } from "../../../utils/addXYValues";
import {
    groupVeloroute,
    makeVeloRoute,
    makeTrainlinesArray,
} from "../../../utils/makeVeloRoute";
import type { RootState } from "../../../store";

export type VelorouteStop = {
    stop_id: string;
    stop_name: string;
    trainlines: string[];
    trainstop?: string;
    x: number;
    y: number;
};

export type Veloroute = {
    id: number;
    name: string;
    len: number;
    route: {
        dist: number;
        leg: VelorouteStop[];
    }[];
    path: string[];
};

export type CombinedVeloroute = {
    id: string;
    route_id: string;
    veloroute_name: string;
    name: string;
    route: {
        dist: number;
        leg: VelorouteStop[];
    }[];
    path: string[];
};

export interface VeloroutesState {
    velorouteList: Veloroute[];
    crossingVelorouteList: any;
    combinedVeloroute: CombinedVeloroute | null;
    isLoading: boolean;
    hasError: boolean;
    crossingRoutesLoading: boolean;
    crossingRoutesError: boolean;
    activeVeloroute: Veloroute | null;
    activeVelorouteSection: number | null;
    hoveredVelorouteSection: number | null;
    activeVelorouteStop: VelorouteStop | null;
    combinedVelorouteActive: any | null;
    crossingVelorouteSection?: number[];
}

export const loadVeloroutes = createAsyncThunk<
    any[],
    string[],
    { state: RootState }
>("veloroutes/setVelorouteList", async (activeIds: string[], thunkAPI) => {
    const startDestinations = thunkAPI.getState().trainroutes.startPos;

    const veloroutesQuery =
        "veloroutes/ids[]=" +
        activeIds.filter((s) => !startDestinations.includes(s)).join("&ids[]=");
    const veloroutes = await fetch(`${VITE_API_URL}${veloroutesQuery}`, {
        headers: headers,
    }).then((response) => response.json());

    return veloroutes;
});

export const loadVeloroute = createAsyncThunk<
    Veloroute,
    any,
    { state: RootState }
>("veloroutes/setVeloroute", async (vroute: Veloroute, thunkAPI) => {
    const { id, name, len } = vroute;
    const velorouteQuery = "veloroute/" + id;
    const veloroute = await fetch(`${VITE_API_URL}${velorouteQuery}`, {
        headers: headers,
    }).then((response) => response.json());

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;
    let velorouteStops = addXYValues(veloroute);
    velorouteStops = makeTrainlinesArray(velorouteStops);
    const velorouteStopsGrouped = groupVeloroute(velorouteStops, trainlines);
    const path = getRoutePath(velorouteStopsGrouped);
    const route = makeVeloRoute(velorouteStopsGrouped);

    return {
        id,
        name,
        len,
        route,
        path,
    };
});

export const loadCrossingVeloroutes = createAsyncThunk(
    "veloroutes/setCrossingVelorouteList",
    async (idx: number, thunkAPI) => {
        //const activeVelorouteSectionIds = thunkAPI.getState().veloroutes.activeVeloroute.route[idx].leg.map(s => s.stop_id);
        // const trainlines = thunkAPI.getState().trainroutes.trainlineList;
        // const activeVelorouteSection = thunkAPI.getState().veloroutes.activeVelorouteSection;
        // const veloroutesQuery = 'veloroutes/ids[]=' + activeVelorouteIds.join('&ids[]=');
        // const veloroutes = await fetch(`${url}${veloroutesQuery}`, {'headers': headers})
        // .then(response => response.json());
        // const velorouteStops = veloroutes.filter(stop => stop.veloroute_id !== activeVelorouteId).map(refactorStopData);
        // let refactoredJourneys = allocateVeloroutestopsToRoute(velorouteStops, trainlines);
        // refactoredJourneys = generateCrossingVeloroutes(activeVelorouteSection, refactoredJourneys);
        // return refactoredJourneys
    },
);

export const setVelorouteSectionActiveThunk = (idx: number) => {
    return (dispatch: any) => {
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
        crossingVelorouteList: {},
        combinedVeloroute: null,
        isLoading: false,
        hasError: false,
        crossingRoutesLoading: false,
        crossingRoutesError: false,
        activeVeloroute: null,
        activeVelorouteSection: null,
        hoveredVelorouteSection: null,
        activeVelorouteStop: null,
        combinedVelorouteActive: null,
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
        setActiveVelorouteStop: (state, action: { payload: any | null }) => {
            state.activeVelorouteStop = action.payload;
        },
        setCrossingVelorouteSection: (state) => {
            state.crossingVelorouteSection = [];
        },
        setCombinedVeloroute: (state, action: { payload: any }) => {
            state.combinedVeloroute = action.payload;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(loadVeloroutes.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
            })
            .addCase(loadVeloroutes.fulfilled, (state, action) => {
                state.velorouteList = action.payload;
                state.isLoading = false;
                state.hasError = false;
            })
            .addCase(loadVeloroutes.rejected, (state) => {
                state.isLoading = false;
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
            })
            .addCase(loadCrossingVeloroutes.pending, (state) => {
                state.crossingRoutesLoading = true;
                state.crossingRoutesError = false;
            })
            .addCase(loadCrossingVeloroutes.fulfilled, (state, action) => {
                state.crossingVelorouteList = action.payload;
                state.crossingRoutesLoading = false;
                state.crossingRoutesError = false;
            })
            .addCase(loadCrossingVeloroutes.rejected, (state) => {
                state.crossingRoutesLoading = false;
                state.crossingRoutesError = true;
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
export const selectCrossingVeloroutesLoading = (state: RootState) =>
    state.veloroutes.crossingRoutesLoading;
export const selectCombinedVeloroute = (state: RootState) =>
    state.veloroutes.combinedVeloroute;
export const selectHoveredVelorouteSection = (state: RootState) =>
    state.veloroutes.hoveredVelorouteSection;

export const {
    setActiveVeloroute,
    setActiveVelorouteSection,
    setHoveredVelorouteSection,
    setActiveVelorouteStop,
    setCrossingVelorouteSection,
    setCombinedVeloroute,
} = veloroutesSlice.actions;

export default veloroutesSlice.reducer;
