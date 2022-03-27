import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { allocateVeloroutestopsToRoute } from '../../../utils/allocateVeloroutestopsToRoute';
import { headers, url } from '../../../config/config';
import { generateCrossingVeloroutes } from '../../../utils/generateCrossingVeloroutes';
import { generateTrainlinesAlongVeloroute } from '../../../utils/generateTrainlinesAlongVeloroute';
import { setTrainLinesAlongVeloroute, setActiveSection } from '../trainroutes/TrainroutesSlice';
import { refactorStopData } from '../../../utils/refactorStopData';

export const loadVeloroutes = createAsyncThunk(
  "veloroutes/setVelorouteList",
  async (activeIds, thunkAPI) => {
    const startDestinations = thunkAPI.getState().trainroutes.startPos;
    const destinations = thunkAPI.getState().destinations.destinationList;

    const veloroutesQuery = 'veloroutes/ids[]=' + activeIds.filter(s => !startDestinations.includes(s)).join('&ids[]=');
      
    const veloroutes = await fetch(`${url}${veloroutesQuery}`, {'headers': headers})
    .then(response => response.json());

    const velorouteIds = [...new Set(veloroutes.map(s => s.veloroute_id))];
    const velorouteIdsQuery = 'veloroutestops/ids[]=' + velorouteIds.join('&ids[]=');

    let velorouteStops = await fetch(`${url}${velorouteIdsQuery}`, {'headers': headers})
    .then(response => response.json());
    velorouteStops = refactorStopData(velorouteStops);

    const refactoredJourneys = allocateVeloroutestopsToRoute(velorouteStops, destinations);

    return refactoredJourneys
  }
);

export const loadCrossingVeloroutes = createAsyncThunk(
  "veloroutes/setCrossingVelorouteList",
  async (activeVelorouteIds, thunkAPI) => {
    const state = thunkAPI.getState()

    const destinations = thunkAPI.getState().destinations.destinationList;
    const activeVelorouteSection = state.veloroutes.activeVelorouteSection;

    const veloroutesQuery = 'veloroutes/ids[]=' + activeVelorouteIds.join('&ids[]=');
      
    const veloroutes = await fetch(`${url}${veloroutesQuery}`, {'headers': headers})
    .then(response => response.json());

    const velorouteIds = [...new Set(veloroutes.map(s => s.veloroute_id))].filter(id => id !== activeVelorouteSection[0].veloroute_id);

    const velorouteIdsQuery = 'veloroutestops/ids[]=' + velorouteIds.join('&ids[]=');

    let velorouteStops = await fetch(`${url}${velorouteIdsQuery}`, {'headers': headers})
    .then(response => response.json());

    velorouteStops = refactorStopData(velorouteStops);
    let refactoredJourneys = allocateVeloroutestopsToRoute(velorouteStops, destinations);
    refactoredJourneys = generateCrossingVeloroutes(activeVelorouteSection, refactoredJourneys);

    return refactoredJourneys
  }
);

export const setVelorouteSectionActiveThunk = ({trainrouteList, activeVeloroute, idx}) => {
  return (dispatch) => {
    const activeVRoute = activeVeloroute.route[idx];
    const activeVelorouteIds = activeVRoute.map(stop => stop.stop_id);
    const stopIds = [activeVRoute[0].stop_id, activeVRoute[activeVRoute.length-1].stop_id];
    const trainlinesAlongVeloroute = generateTrainlinesAlongVeloroute(trainrouteList, stopIds);
    dispatch(setActiveVelorouteSection(activeVRoute));
    dispatch(setTrainLinesAlongVeloroute(trainlinesAlongVeloroute));
    dispatch(loadCrossingVeloroutes(activeVelorouteIds));
    dispatch(setCombinedVeloroute(null));
    dispatch(setActiveSection(null));
  };
};

export const veloroutesSlice = createSlice({
    name: "veloroutes",
    initialState: {
        velorouteList: [],
        crossingVelorouteList: {},
        combinedVeloroute: null,
        isLoading: false,
        hasError: false,
        crossingRoutesLoading: false,
        crossingRoutesError: false,
        activeVeloroute: null,
        activeVelorouteSection: null,
        hoveredVelorouteSection: null,
        activeVelorouteStop: null,
        combinedVelorouteActive: null
    },
    reducers: {
      setActiveVeloroute: (state, action) => {
        state.activeVeloroute = action.payload
      },
      setActiveVelorouteSection: (state, action) => {
        state.activeVelorouteSection = action.payload
      },
      setHoveredVelorouteSection: (state, action) => {
        state.hoveredVelorouteSection = action.payload
      },
      setActiveVelorouteStop: (state, action) => {
        state.activeVelorouteStop = action.payload
      },
      setCrossingVelorouteSection: (state, action) => {
        state.crossingVelorouteSection = []
      },
      setCombinedVeloroute: (state, action) => {
        state.combinedVeloroute = action.payload
      }
    },
    extraReducers: {
      [loadVeloroutes.pending]: (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      },
      [loadVeloroutes.fulfilled]: (state, action) => {
        state.velorouteList = action.payload;
        state.isLoading = false;
        state.hasError = false;
      },
      [loadVeloroutes.rejected]: (state, action) => {
        state.isLoading = false;
        state.hasError = true;
      },
      [loadCrossingVeloroutes.pending]: (state, action) => {
        state.crossingRoutesLoading = true;
        state.crossingRoutesError = false;
      },
      [loadCrossingVeloroutes.fulfilled]: (state, action) => {
        state.crossingVelorouteList = action.payload;
        state.crossingRoutesLoading = false;
        state.crossingRoutesError = false;
      },
      [loadCrossingVeloroutes.rejected]: (state, action) => {
        state.crossingRoutesLoading = false;
        state.crossingRoutesError = true;
      }
    }
  });

export const selectVelorouteList = (state) => state.veloroutes.velorouteList;
export const selectCrossingVelorouteList = (state) => state.veloroutes.crossingVelorouteList;
export const selectActiveVeloroute = (state) => state.veloroutes.activeVeloroute;
export const selectActiveVelorouteSection = (state) => state.veloroutes.activeVelorouteSection;
export const selectActiveVelorouteStop = (state) => state.veloroutes.activeVelorouteStop;
export const selectVeloroutesLoading = (state) => state.veloroutes.isLoading;
export const selectCrossingVeloroutesLoading = (state) => state.veloroutes.crossingRoutesLoading;
export const selectCombinedVeloroute = (state) => state.veloroutes.combinedVeloroute;
export const selectHoveredVelorouteSection = (state) => state.veloroutes.hoveredVelorouteSection;

export const {
    setActiveVeloroute,
    setActiveVelorouteSection,
    setHoveredVelorouteSection,
    setActiveVelorouteStop,
    setCrossingVelorouteSection,
    setCombinedVeloroute
} = veloroutesSlice.actions;

 export default veloroutesSlice.reducer;