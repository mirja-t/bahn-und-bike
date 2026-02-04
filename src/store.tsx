import { configureStore } from "@reduxjs/toolkit";
import appReducer, { type AppState } from "./AppSlice.tsx";
import veloroutesReducer, {
    type VeloroutesState,
} from "./components/map/veloroutes/VeloroutesSlice.tsx";
import trainroutesReducer, {
    type TrainroutesState,
} from "./components/map/trainroutes/TrainroutesSlice.tsx";

export interface RootState {
    app: AppState;
    trainroutes: TrainroutesState;
    veloroutes: VeloroutesState;
}

const store = configureStore({
    reducer: {
        app: appReducer,
        trainroutes: trainroutesReducer,
        veloroutes: veloroutesReducer,
    },
});

export type AppDispatch = typeof store.dispatch;

export default store;
