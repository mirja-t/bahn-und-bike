import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../AppSlice";
import destinationsReducer from "../components/destinationDetails/DestinationDetailsSlice";
import trainroutesReducer from "../components/map/trainroutes/TrainroutesSlice";
import veloroutesReducer from "../components/map/veloroutes/VeloroutesSlice";
import type { RootState } from "../store";

const reducers = {
    app: appReducer,
    destinations: destinationsReducer,
    trainroutes: trainroutesReducer,
    veloroutes: veloroutesReducer,
};

const defaultMockState: RootState = {
    app: appReducer(undefined, { type: "@@INIT" }),
    destinations: destinationsReducer(undefined, { type: "@@INIT" }),
    trainroutes: trainroutesReducer(undefined, { type: "@@INIT" }),
    veloroutes: veloroutesReducer(undefined, { type: "@@INIT" }),
};

export const createMockStore = (preloadedState: Partial<RootState> = {}) => {
    const mergedState: RootState = {
        ...defaultMockState,
        ...preloadedState,
        app: {
            ...defaultMockState.app,
            ...preloadedState.app,
        },
        destinations: {
            ...defaultMockState.destinations,
            ...preloadedState.destinations,
        },
        trainroutes: {
            ...defaultMockState.trainroutes,
            ...preloadedState.trainroutes,
        },
        veloroutes: {
            ...defaultMockState.veloroutes,
            ...preloadedState.veloroutes,
        },
    };

    return configureStore({
        reducer: reducers,
        preloadedState: mergedState,
    });
};

export type MockStore = ReturnType<typeof createMockStore>;
