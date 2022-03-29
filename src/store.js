import {configureStore} from '@reduxjs/toolkit';
import appReducer from './AppSlice';
import veloroutesReducer from './components/map/veloroutes/VeloroutesSlice';
import trainroutesReducer from './components/map/trainroutes/TrainroutesSlice';
import destinationReducer from './components/destinationDetails/destinationDetailsSlice';

export default configureStore({
    reducer: {
        app: appReducer,
        trainroutes: trainroutesReducer,
        veloroutes: veloroutesReducer,
        destinations: destinationReducer
    }
});