import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import {
    setActiveSection,
    loadTrainroutesAlongVeloroute,
} from "../trainroutes/TrainroutesSlice";
import { makeVeloRoute } from "../../../utils/makeVeloRoute";
import type { AppDispatch, RootState } from "../../../store";

export type VeloroutesResponseStop = {
    name: string;
    dest_name: string;
    dist: number;
    gcs: string;
    lat: string;
    lon: string;
    stop_number: number;
    trainlines: string; // comma separated string of trainline_ids from API
    trainstop: string;
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
export type VelorouteListItem = {
    id: string;
    name: string;
    len: number;
    gcs: string;
};
export interface VeloroutesState {
    velorouteList: VelorouteListItem[];
    velorouteListIsLoading: boolean;
    isLoading: boolean;
    hasError: boolean;
    veloroute: { active: Veloroute | null; preview: Veloroute | null };
    activeVelorouteSection: number | null;
    hoveredVelorouteSection: number | null;
    activeVelorouteStop: VelorouteStop | null;
    velorouteIsLoading: boolean;
    velorouteHasError: boolean;
}

export const loadVeloroutes = createAsyncThunk<
    VelorouteListItem[],
    string[],
    { state: RootState }
>("veloroutes/setVelorouteList", async (trainstations: string[], thunkAPI) => {
    const state = thunkAPI.getState();
    const startPosId = state.trainroutes.startPos;

    const normalizedIds = Array.from(
        new Set(
            trainstations
                .map((id) => id.trim())
                .filter((id) => id.length > 0 && id !== startPosId),
        ),
    );

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
    { active?: Veloroute; preview?: Veloroute },
    { id: string; preview?: boolean },
    { state: RootState }
>("veloroutes/setVeloroute", async ({ id, preview = false }, thunkAPI) => {
    const velorouteQuery = "veloroute/" + id;
    const responseStops: VeloroutesResponseStop[] = await fetch(
        `${VITE_API_URL}${velorouteQuery}`,
        {
            headers: headers,
        },
    ).then((response) => response.json());

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;
    const activeVeloroute = makeVeloRoute(responseStops, trainlines);
    const key = preview ? "preview" : "active";
    return { [key]: activeVeloroute };
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
        veloroute: { active: null, preview: null },
        velorouteIsLoading: false,
        velorouteHasError: false,
        activeVelorouteSection: null,
        hoveredVelorouteSection: null,
        activeVelorouteStop: null,
    } as VeloroutesState,
    reducers: {
        setActiveVeloroute: (state, action: { payload: Veloroute | null }) => {
            state.veloroute.active = action.payload;
        },
        setPreviewVeloroute: (state, action: { payload: Veloroute | null }) => {
            state.veloroute.preview = action.payload;
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
    state.veloroutes.veloroute.active;
export const selectPreviewVeloroute = (state: RootState) =>
    state.veloroutes.veloroute.preview;
export const selectActiveVelorouteSection = (state: RootState) =>
    state.veloroutes.activeVelorouteSection;
export const selectActiveVelorouteStop = (state: RootState) =>
    state.veloroutes.activeVelorouteStop;
export const selectVeloroutesLoading = (state: RootState) =>
    state.veloroutes.isLoading;
export const selectVelorouteListIsLoading = (state: RootState) =>
    state.veloroutes.velorouteListIsLoading;
export const selectHoveredVelorouteSection = (state: RootState) =>
    state.veloroutes.hoveredVelorouteSection;

export const {
    setActiveVeloroute,
    setPreviewVeloroute,
    setActiveVelorouteSection,
    setHoveredVelorouteSection,
    setActiveVelorouteStop,
    setVelorouteList,
} = veloroutesSlice.actions;

export default veloroutesSlice.reducer;
