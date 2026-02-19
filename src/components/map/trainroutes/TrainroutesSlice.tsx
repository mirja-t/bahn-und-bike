import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../../config/config";
import type { RootState } from "../../../store";
import { makeTrainRoutes } from "../../../utils/makeTrainRoutes";
import { createNewRoute } from "../../../utils/createNewRoute";

export type ResponseStop = {
    destination_id: string;
    destination_name: string;
    dur: number;
    lat: string;
    lon: string;
    name: string;
    stop_number: number;
    trainline_id: string;
};
type Trainstop = {
    stop_name: string;
    stop_id: string;
    trainline_id?: string;
    lat: number;
    lon: number;
    x: number;
    y: number;
};
type Connection = {
    stop_name: string;
    initial_trains: string[];
    connecting_trains: string[];
};
export type CurrentTrainroute = {
    id: string;
    name: string;
    dur: number;
    trainlines: string[];
    pathLength: number;
    firstStation: Trainstop;
    lastStation: Trainstop;
    stopIds: string[];
    points: string;
    connection: Connection | null;
};
export type CurrentTrainroutes = CurrentTrainroute[];

export interface TrainroutesState {
    startPos: string;
    travelInterval: number;
    trainlineList: string[] | null;
    currentTrainroutes: CurrentTrainroutes;
    trainroutesLoading: boolean;
    trainroutesError: boolean;
    activeSpot: Trainstop | null;
    activeSection: CurrentTrainroute | null;
    trainroutesAlongVeloroute: CurrentTrainroute[];
    trainroutesAlongVelorouteLoading: boolean;
    trainroutesAlongVelorouteError: boolean;
    trainlineNames?: string[];
}

export const loadTrainroutes = createAsyncThunk<
    CurrentTrainroutes,
    { start: string; value: number; direct: boolean },
    { state: RootState }
>("trainroutes/setTrainroutes", async ({ start, value, direct }, thunkAPI) => {
    const connectionsQuery = direct
        ? "trainstops/" + start
        : "connections/" + start;
    const connections: ResponseStop[] = await fetch(
        `${VITE_API_URL}${connectionsQuery}`,
        {
            headers: headers,
        },
    ).then((response) => {
        if (response.status !== 200) {
            throw new Error("Bad Server Response");
        }
        return response.json();
    });

    const currentTrainroutes = makeTrainRoutes(
        connections,
        start,
        value * 30,
        direct,
    );
    const trainlineList = direct
        ? currentTrainroutes.map((route) => route.trainlines).flat()
        : null;
    thunkAPI.dispatch(setTrainlineList(trainlineList));

    return currentTrainroutes;
});

export const loadTrainroutesAlongVeloroute = createAsyncThunk<
    CurrentTrainroutes,
    number,
    { state: RootState }
>("trainroutes/setTrainroutesAlongVeloroute", async (idx: number, thunkAPI) => {
    const startdestination = thunkAPI.getState().trainroutes.startPos;
    const activeVeloroute = thunkAPI.getState().veloroutes.activeVeloroute;
    const startId = activeVeloroute
        ? activeVeloroute.route[idx].leg[0].trainstop
        : undefined;
    const endId = activeVeloroute
        ? activeVeloroute.route[idx].leg[
              activeVeloroute.route[idx].leg.length - 1
          ].trainstop
        : undefined;

    const connections: CurrentTrainroutes = [];
    const fetchConnection = async (id: string): Promise<ResponseStop[]> => {
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

    const connectionStart: ResponseStop[] = await fetchConnection(
        startId || "",
    );
    const connectionEnd: ResponseStop[] = await fetchConnection(endId || "");
    connections.push(createNewRoute(connectionStart[0], connectionStart)); // duration is not correct, but we need the trainlines and stopIds for the veloroute section
    connections.push(createNewRoute(connectionEnd[0], connectionEnd));

    return connections;
});

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: "8011160",
        travelInterval: 30,
        trainlineList: null,
        currentTrainroutes: [],
        trainroutesLoading: false,
        trainroutesError: false,
        activeSpot: null,
        activeSection: null,
        trainroutesAlongVeloroute: [],
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
        setTrainlineList: (state, action: { payload: string[] | null }) => {
            state.trainlineList = action.payload;
        },
        setActiveSpot: (state, action: { payload: Trainstop | null }) => {
            state.activeSpot = action.payload;
        },
        setActiveSection: (
            state,
            action: { payload: CurrentTrainroute | null },
        ) => {
            state.activeSection = action.payload;
        },
        setTrainroutesAlongVeloroute: (
            state,
            action: { payload: CurrentTrainroute[] },
        ) => {
            state.trainroutesAlongVeloroute = action.payload;
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
export const selectTrainroutesAlongVeloroute = (state: RootState) =>
    state.trainroutes.trainroutesAlongVeloroute;
export const selectTrainrouteListLoading = (state: RootState) =>
    state.trainroutes.trainroutesLoading;
export const selectTrainroutesAlongVelorouteLoading = (state: RootState) =>
    state.trainroutes.trainroutesAlongVelorouteLoading;
export const selectStartPos = (state: RootState) => state.trainroutes.startPos;
export const selectCurrentTrainroutes = (state: RootState) =>
    state.trainroutes.currentTrainroutes;
export const selectTrainlineList = (state: RootState) =>
    state.trainroutes.trainlineList;

export const {
    setActiveSpot,
    setActiveSection,
    setTrainroutesAlongVeloroute,
    setStartPos,
    setCurrentTrainroutes,
    setTrainlineList,
} = trainroutesSlice.actions;

export default trainroutesSlice.reducer;
