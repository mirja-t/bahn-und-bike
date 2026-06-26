import { createSlice } from "@reduxjs/toolkit";
import { setActiveSection } from "../trainroutes/TrainroutesSlice";
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

export const setVelorouteSectionActiveThunk = (idx: number) => {
    return (dispatch: AppDispatch) => {
        dispatch(setActiveVelorouteSectionIdx(idx));
        dispatch(setActiveSection(null));
    };
};

export interface VeloroutesState {
    velorouteListIsLoading: boolean;
    activeVelorouteId: string | null;
    activeVelorouteSectionIdx: number | null;
    hoveredVelorouteSectionIdx: number | null;
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
        velorouteListIsLoading: false,
        veloroutesHasError: false,
        activeVelorouteId: null,
        velorouteIsLoading: false,
        velorouteHasError: false,
        activeVelorouteSectionIdx: null,
        hoveredVelorouteSectionIdx: null,
        activeVelorouteStop: null,
        maxDistToNextStation: 2,
    } as VeloroutesState,
    reducers: {
        setMaxDistToNextStation: (state, action: { payload: number }) => {
            state.maxDistToNextStation = action.payload;
        },
        setActiveVelorouteId: (state, action: { payload: string | null }) => {
            state.activeVelorouteId = action.payload;
        },
        setActiveVelorouteSectionIdx: (
            state,
            action: { payload: number | null },
        ) => {
            state.activeVelorouteSectionIdx = action.payload;
        },
        setHoveredVelorouteSectionIdx: (
            state,
            action: { payload: number | null },
        ) => {
            state.hoveredVelorouteSectionIdx = action.payload;
        },
        setActiveVelorouteStop: (
            state,
            action: { payload: VelorouteStop | null },
        ) => {
            state.activeVelorouteStop = action.payload;
        },
    },
});

export const selectActiveVelorouteId = (state: RootState) =>
    state.veloroutes.activeVelorouteId;
export const selectActiveVelorouteSectionIdx = (state: RootState) =>
    state.veloroutes.activeVelorouteSectionIdx;
export const selectActiveVelorouteStop = (state: RootState) =>
    state.veloroutes.activeVelorouteStop;
export const selectVeloroutesLoading = (state: RootState) =>
    state.veloroutes.velorouteIsLoading ||
    state.veloroutes.velorouteListIsLoading;
export const selectHoveredVelorouteSectionIdx = (state: RootState) =>
    state.veloroutes.hoveredVelorouteSectionIdx;
export const selectMaxDistToNextStation = (state: RootState) =>
    state.veloroutes.maxDistToNextStation;

export const {
    setActiveVelorouteId,
    setActiveVelorouteSectionIdx,
    setHoveredVelorouteSectionIdx,
    setActiveVelorouteStop,
    setMaxDistToNextStation,
} = veloroutesSlice.actions;

export default veloroutesSlice.reducer;
