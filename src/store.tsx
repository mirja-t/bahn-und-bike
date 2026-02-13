import { configureStore } from "@reduxjs/toolkit";
import appReducer, { type AppState } from "./AppSlice.tsx";
import veloroutesReducer, {
    type VeloroutesState,
} from "./components/map/veloroutes/VeloroutesSlice.tsx";
import trainroutesReducer, {
    type TrainroutesState,
} from "./components/map/trainroutes/TrainroutesSlice.tsx";
import destinationsReducer, {
    type DestinationsState,
} from "./components/destinationDetails/destinationDetailsSlice.tsx";

export interface RootState {
    app: AppState;
    destinations: DestinationsState;
    trainroutes: TrainroutesState;
    veloroutes: VeloroutesState;
}

const store = configureStore({
    reducer: {
        app: appReducer,
        destinations: destinationsReducer,
        trainroutes: trainroutesReducer,
        veloroutes: veloroutesReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type StoreRootState = ReturnType<typeof store.getState>;

export default store;
