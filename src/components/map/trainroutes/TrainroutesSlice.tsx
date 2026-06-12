import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "@/config/config";
import type { RootState } from "../../../store";
import { createNewRoute } from "../../../utils/createNewRoute";

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
    trainstops: number[];
    currentTrainroutes: CurrentTrainroutes;
    trainroutesLoading: boolean;
    trainroutesError: boolean;
    activeSpot: Trainstop | null;
    activeSection: CurrentTrainroute | null;
    previewSection: CurrentTrainroute | null;
    trainroutesAlongVeloroute: CurrentTrainroute[];
    trainroutesAlongVelorouteLoading: boolean;
    trainroutesAlongVelorouteError: boolean;
    maxDistToNextStation: number;
    trainlineNames?: string[];
}

export const loadTrainroutesAlongVeloroute = createAsyncThunk<
    CurrentTrainroutes,
    number,
    { state: RootState }
>("trainroutes/setTrainroutesAlongVeloroute", async (idx: number, thunkAPI) => {
    const startdestination = thunkAPI.getState().trainroutes.startPos;
    const activeVeloroute = thunkAPI.getState().veloroutes.veloroute;
    const startId = activeVeloroute
        ? activeVeloroute.route[idx].leg[0].trainstop
        : undefined;
    const endId = activeVeloroute
        ? activeVeloroute.route[idx].leg[
              activeVeloroute.route[idx].leg.length - 1
          ].trainstop
        : undefined;

    const connections: CurrentTrainroutes = [];
    const fetchConnection = async (id: number): Promise<CurrentTrainroute> => {
        const connectionQuery = "connection/" + startdestination + "&" + id;
        const connection = await fetch(`${VITE_API_URL}${connectionQuery}`, {
            headers: headers,
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error("Bad Server Response");
            }
            return response.json();
        });
        const reversedConnection = [...connection].reverse();
        const route = createNewRoute(reversedConnection[0], reversedConnection);
        return route;
    };
    const seenIds = new Set<number>();
    for (const id of [startId, endId]) {
        if (!id || seenIds.has(id)) {
            continue;
        }
        const route = await fetchConnection(id);
        connections.push(route);
        seenIds.add(id);
    }
    return connections;
});

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: 2975,
        isDirect: true,
        travelInterval: 30,
        travelDuration: 0,
        trainstops: [],
        currentTrainroutes: [],
        trainroutesLoading: false,
        trainroutesError: false,
        activeSpot: null,
        activeSection: null,
        previewSection: null,
        trainroutesAlongVeloroute: [],
        trainroutesAlongVelorouteLoading: false,
        trainroutesAlongVelorouteError: false,
        maxDistToNextStation: 2, // in km, default value, can be changed by user in VelorouteDetails
    } as TrainroutesState,
    reducers: {
        setTrainstops: (state, action: { payload: number[] }) => {
            state.trainstops = action.payload;
        },
        setActiveSpot: (state, action: { payload: Trainstop | null }) => {
            state.activeSpot = action.payload;
        },
        setActiveSection: (
            state,
            action: { payload: CurrentTrainroute | null },
        ) => {
            state.activeSection = action.payload;
            // When clearing the active section, also clear any preview
            if (action.payload === null) {
                state.previewSection = null;
            }
        },
        setPreviewSection: (
            state,
            action: { payload: CurrentTrainroute | null },
        ) => {
            state.previewSection = action.payload;
        },
        setTrainroutesAlongVeloroute: (
            state,
            action: { payload: CurrentTrainroute[] },
        ) => {
            state.trainroutesAlongVeloroute = action.payload;
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
        setTrainroutesLoading: (state, action: { payload: boolean }) => {
            state.trainroutesLoading = action.payload;
        },
        setTrainroutesError: (state, action: { payload: boolean }) => {
            state.trainroutesError = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTrainroutesAlongVeloroute.pending, (state) => {
                state.trainroutesAlongVelorouteLoading = true;
                state.trainroutesAlongVelorouteError = false;
            })
            .addCase(
                loadTrainroutesAlongVeloroute.fulfilled,
                (state, action) => {
                    state.trainroutesAlongVeloroute = action.payload;
                    state.trainroutesAlongVelorouteLoading = false;
                    state.trainroutesAlongVelorouteError = false;
                },
            )
            .addCase(loadTrainroutesAlongVeloroute.rejected, (state) => {
                state.trainroutesAlongVelorouteLoading = false;
                state.trainroutesAlongVelorouteError = true;
            });
    },
});

export const selectActiveSpot = (state: RootState) =>
    state.trainroutes.activeSpot;
export const selectActiveSection = (state: RootState) =>
    state.trainroutes.activeSection;
export const selectPreviewSection = (state: RootState) =>
    state.trainroutes.previewSection;
export const selectTrainroutesAlongVeloroute = (state: RootState) =>
    state.trainroutes.trainroutesAlongVeloroute;
export const selectTrainrouteListLoading = (state: RootState) =>
    state.trainroutes.trainroutesLoading;
export const selectTrainroutesAlongVelorouteLoading = (state: RootState) =>
    state.trainroutes.trainroutesAlongVelorouteLoading;
export const selectStartPos = (state: RootState) => state.trainroutes.startPos;
export const selectIsDirect = (state: RootState) => state.trainroutes.isDirect;
export const selectTrainTravelDuration = (state: RootState) =>
    state.trainroutes.travelDuration;
export const selectCurrentTrainroutes = (state: RootState) =>
    state.trainroutes.currentTrainroutes;
export const selectTrainroutesLoading = (state: RootState) =>
    state.trainroutes.trainroutesLoading ||
    state.trainroutes.trainroutesAlongVelorouteLoading;

export const {
    setActiveSpot,
    setActiveSection,
    setPreviewSection,
    setTrainroutesAlongVeloroute,
    setStartPos,
    setIsDirect,
    setTrainTravelDuration,
    setTrainstops,
    setTrainroutesLoading,
    setTrainroutesError,
} = trainroutesSlice.actions;

export default trainroutesSlice.reducer;
