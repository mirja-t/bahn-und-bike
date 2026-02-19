import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import {
    setActiveSection,
    loadTrainroutesAlongVeloroute,
} from "../trainroutes/TrainroutesSlice";
import { getRoutePath } from "../../../utils/getRoutePath";
import {
    groupVeloroute,
    makeVeloRoute,
    makeTrainlinesArray,
} from "../../../utils/makeVeloRoute";
import type { RootState } from "../../../store";
import { germanyBounds, SvgMapBuilder } from "../../../utils/svgMap";

export type VelorouteStop = {
    stop_id: string;
    stop_name: string;
    trainlines: string[];
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

type ResponseStop = {
    id: string;
    dest_name: string;
    dist: number;
    lat: string;
    lon: string;
    stop_number: number;
    trainlines: string[];
    trainstop?: string;
    veloroute_id: string;
};
export const loadVeloroute = createAsyncThunk<
    Veloroute,
    Veloroute,
    { state: RootState }
>("veloroutes/setVeloroute", async (vroute: Veloroute, thunkAPI) => {
    const { id, name, len } = vroute;
    const velorouteQuery = "veloroute/" + id;
    const responseStops: ResponseStop[] = await fetch(
        `${VITE_API_URL}${velorouteQuery}`,
        {
            headers: headers,
        },
    ).then((response) => response.json());

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;
    const addXY = (stop: ResponseStop) => {
        const [x, y] = SvgMapBuilder.getMapPosition(
            parseFloat(stop.lon),
            parseFloat(stop.lat),
            germanyBounds,
        );
        return {
            ...stop,
            x,
            y,
        };
    };
    const velorouteStops = makeTrainlinesArray(responseStops.map(addXY));
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

export const setVelorouteSectionActiveThunk = (idx: number) => {
    return (dispatch) => {
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
