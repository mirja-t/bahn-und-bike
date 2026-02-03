import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./AppSlice.tsx";
import veloroutesReducer from "./components/map/veloroutes/VeloroutesSlice.tsx";
import trainroutesReducer from "./components/map/trainroutes/TrainroutesSlice.tsx";

export default configureStore({
    reducer: {
        app: appReducer,
        trainroutes: trainroutesReducer,
        veloroutes: veloroutesReducer,
    },
});
