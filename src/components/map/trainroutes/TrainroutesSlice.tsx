import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import type { RootState } from "../../../store";
import { generateTrainlines } from "../../../utils/generateTrainlines";
import { generateTrainlineTree } from "../../../utils/treeData/generateTrainlineTree";
import { refactorStopData } from "../../../utils/refactorStopData";
import { makeTrainConnection } from "../../../utils/makeTrainConnection";

export interface LoadTrainroutesParams {
    start: string;
    value: number;
    direct: boolean;
}

export type CurrentTrainroutes = any[];

export interface TrainroutesState {
    startPos: string;
    travelInterval: number;
    trainrouteTree: Record<string, any>;
    trainlineList: Record<string, any> | string[] | null;
    currentTrainroutes: CurrentTrainroutes;
    trainroutesLoading: boolean;
    trainroutesError: boolean;
    activeSpot: string | null;
    activeSection: Record<string, any> | null;
    trainlinesAlongVeloroute: any[];
    trainroutesAlongVelorouteLoading: boolean;
    trainroutesAlongVelorouteError: boolean;
    trainlineNames?: any;
}

export const loadTrainroutes = createAsyncThunk<
    CurrentTrainroutes,
    LoadTrainroutesParams,
    { state: RootState }
>("trainroutes/setTrainroutes", async ({ start, value, direct }, thunkAPI) => {
    const connectionsQuery = direct
        ? "trainstops/" + start
        : "connections/" + start;
    const connections = await fetch(`${VITE_API_URL}${connectionsQuery}`, {
        headers: headers,
    }).then((response) => {
        if (response.status !== 200) {
            throw new Error("Bad Server Response");
        }
        return response.json();
    });
    const trainstopsRefactored = connections.map(refactorStopData);
    const startStops = trainstopsRefactored.filter((s) => s.stop_id === start);
    const trainrouteList = generateTrainlines(trainstopsRefactored);
    const currentTrainroutes = generateTrainlineTree(
        trainrouteList,
        startStops,
        value,
        direct,
    );

    const trainlineList = direct ? startStops.map((s) => s.trainline_id) : null;
    thunkAPI.dispatch(setTrainlineList(trainlineList));

    return currentTrainroutes;
});

export const loadTrainroutesAlongVeloroute = createAsyncThunk<
    any[],
    number,
    { state: RootState }
>("trainroutes/setTrainroutesAlongVeloroute", async (idx: number, thunkAPI) => {
    const startdestination = thunkAPI.getState().trainroutes.startPos;
    const activeVeloroute = thunkAPI.getState().veloroutes.activeVeloroute;
    const startId = activeVeloroute.route[idx].leg[0].trainstop;
    const endId =
        activeVeloroute.route[idx].leg[
            activeVeloroute.route[idx].leg.length - 1
        ].trainstop;

    const connections = [];
    const fetchConnection = async (id) => {
        const connectionQuery = "connection/" + startdestination + "&" + id;
        const connection = await fetch(`${VITE_API_URL}${connectionQuery}`, {
            headers: headers,
        }).then((response) => {
            if (response.status !== 200) {
                throw new Error("Bad Server Response");
            }
            return response.json();
        });
        return connection;
    };

    const connectionStart = await fetchConnection(startId);
    const connectionEnd = await fetchConnection(endId);
    connections.push(makeTrainConnection(connectionStart));
    connections.push(makeTrainConnection(connectionEnd));

    return connections;
});

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: "8011160",
        travelInterval: 30,
        trainrouteTree: {},
        trainlineList: {},
        currentTrainroutes: [],
        trainroutesLoading: false,
        trainroutesError: false,
        activeSpot: null,
        activeSection: null,
        trainlinesAlongVeloroute: [],
        trainroutesAlongVelorouteLoading: false,
        trainroutesAlongVelorouteError: false,
    } as TrainroutesState,
    reducers: {
        setCurrentTrainroutes: (
            state,
            action: { payload: CurrentTrainroutes },
        ) => {
            state.currentTrainroutes = action.payload;
        },
        setTrainlineList: (state, action: { payload: any }) => {
            state.trainlineList = action.payload;
        },
        setActiveSpot: (state, action: { payload: string | null }) => {
            state.activeSpot = action.payload;
        },
        setActiveSection: (
            state,
            action: { payload: Record<string, any> | null },
        ) => {
            state.activeSection = action.payload;
        },
        setTrainLinesAlongVeloroute: (state, action: { payload: any[] }) => {
            state.trainlinesAlongVeloroute = action.payload;
        },
        setTrainlinesNames: (state, action: { payload: any }) => {
            state.trainlineNames = action.payload;
        },
        setStartPos: (state, action: { payload: string }) => {
            state.startPos = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTrainroutes.pending, (state) => {
                state.trainroutesLoading = true;
                state.trainroutesError = false;
            })
            .addCase(loadTrainroutes.fulfilled, (state, action) => {
                state.currentTrainroutes = action.payload;
                state.trainroutesLoading = false;
                state.trainroutesError = false;
            })
            .addCase(loadTrainroutes.rejected, (state) => {
                state.trainroutesLoading = false;
                state.trainroutesError = true;
            })
            .addCase(loadTrainroutesAlongVeloroute.pending, (state) => {
                state.trainroutesAlongVelorouteLoading = true;
                state.trainroutesAlongVelorouteError = false;
            })
            .addCase(
                loadTrainroutesAlongVeloroute.fulfilled,
                (state, action) => {
                    state.trainlinesAlongVeloroute = action.payload;
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

export const selectTrainrouteList = (state: RootState) =>
    state.trainroutes.trainrouteTree;
export const selectActiveSpot = (state: RootState) =>
    state.trainroutes.activeSpot;
export const selectActiveSection = (state: RootState) =>
    state.trainroutes.activeSection;
export const selectTrainlinesAlongVeloroute = (state: RootState) =>
    state.trainroutes.trainlinesAlongVeloroute;
export const selectTrainrouteListLoading = (state: RootState) =>
    state.trainroutes.trainroutesLoading;
export const selectTrainlinesAlongVelorouteLoading = (state: RootState) =>
    state.trainroutes.trainlinesAlongVelorouteLoading;
export const selectStartPos = (state: RootState) => state.trainroutes.startPos;
export const selectCurrentTrainroutes = (state: RootState) =>
    state.trainroutes.currentTrainroutes;
export const selectTrainlineList = (state: RootState) =>
    state.trainroutes.trainlineList;

export const {
    setActiveSpot,
    setActiveSection,
    setTrainLinesAlongVeloroute,
    setStartPos,
    setCurrentTrainroutes,
    setTrainlineList,
} = trainroutesSlice.actions;

export default trainroutesSlice.reducer;
