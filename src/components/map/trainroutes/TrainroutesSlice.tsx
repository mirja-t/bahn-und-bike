import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../../store";

export type TrainstopAPIResponse = {
    station_id: number;
    station_name: string;
    dur: number;
    lat: number;
    lon: number;
    name: string;
    stop_number: number | null;
    trainline_id: string;
    next_station_id: number | null;
};
export type TrainstopsAPIResponse = Record<string, TrainstopAPIResponse[]>;
export type Trainstop = TrainstopAPIResponse & {
    x: number;
    y: number;
};
export type Train = {
    trainline_id: string;
    trainline_name: string;
};
export type ResponseTrainLine = {
    id: string;
    name: string;
    agency_name: string;
};
type Connection = {
    station_name: string;
    initial_trains: Train[];
    connecting_trains: Train[];
};
export type CurrentTrainroute = {
    id: string;
    name: string;
    dur: number;
    trainlines: Train[];
    pathLength: number;
    firstStation: Trainstop;
    lastStation: Trainstop;
    routestops: Trainstop[];
    points: string;
    connection: Connection | null;
};
export type CurrentTrainroutes = CurrentTrainroute[];

export interface TrainroutesState {
    startPos: number;
    isDirect: boolean;
    travelInterval: number;
    travelDuration: number;
    activeSpot: Trainstop | null;
    activeSectionId: string | null;
    previewSectionId: string | null;
    trainlineNames?: string[];
}

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: 2975,
        isDirect: true,
        travelInterval: 30,
        travelDuration: 0,
        activeSpot: null,
        activeSectionId: null,
        previewSectionId: null,
    } as TrainroutesState,
    reducers: {
        setActiveSpot: (state, action: { payload: Trainstop | null }) => {
            state.activeSpot = action.payload;
        },
        setActiveSectionId: (state, action: { payload: string | null }) => {
            state.activeSectionId = action.payload;
        },
        setPreviewSectionId: (state, action: { payload: string | null }) => {
            state.previewSectionId = action.payload;
        },
        setStartPos: (state, action: { payload: number }) => {
            state.startPos = action.payload;
        },
        setIsDirect: (state, action: { payload: boolean }) => {
            state.isDirect = action.payload;
        },
        setTrainTravelDuration: (state, action: { payload: number }) => {
            state.travelDuration = action.payload;
        },
    },
});

export const selectActiveSpot = (state: RootState) =>
    state.trainroutes.activeSpot;
export const selectActiveSectionId = (state: RootState) =>
    state.trainroutes.activeSectionId;
export const selectPreviewSectionId = (state: RootState) =>
    state.trainroutes.previewSectionId;
export const selectStartPos = (state: RootState) => state.trainroutes.startPos;
export const selectIsDirect = (state: RootState) => state.trainroutes.isDirect;
export const selectTrainTravelDuration = (state: RootState) =>
    state.trainroutes.travelDuration;

export const {
    setActiveSpot,
    setActiveSectionId,
    setPreviewSectionId,
    setStartPos,
    setIsDirect,
    setTrainTravelDuration,
} = trainroutesSlice.actions;

export default trainroutesSlice.reducer;
