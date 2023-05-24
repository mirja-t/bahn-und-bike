import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import { allocateVeloroutestopsToRoute } from '../../../utils/allocateVeloroutestopsToRoute';
import { headers, url } from '../../../config/config';
//import { generateCrossingVeloroutes } from '../../../utils/generateCrossingVeloroutes';
import { setActiveSection, loadTrainroutesAlongVeloroute } from '../trainroutes/TrainroutesSlice';
//import { refactorStopData } from '../../../utils/refactorStopData';
import { getRoutePath } from '../../../utils/getRoutePath';
import { addXYValues } from '../../../utils/addXYValues';
import { groupVeloroute, makeVeloRoute, makeTrainlinesArray } from '../../../utils/makeVeloRoute';

export const loadVeloroutes = createAsyncThunk(
  "veloroutes/setVelorouteList",
  async (activeIds, thunkAPI) => {
    const startDestinations = thunkAPI.getState().trainroutes.startPos;

    const veloroutesQuery = 'veloroutes/ids[]=' + activeIds.filter(s => !startDestinations.includes(s)).join('&ids[]=');
    const veloroutes = await fetch(`${url}${veloroutesQuery}`, {'headers': headers})
    .then(response => response.json());

    return veloroutes
  }
);

export const loadVeloroute = createAsyncThunk(
  "veloroutes/setVeloroute",
  async (vroute, thunkAPI) => {
    const {id, name, len} = vroute;
    const velorouteQuery = 'veloroute/' + id;
    const veloroute = await fetch(`${url}${velorouteQuery}`, {'headers': headers})
    .then(response => response.json());

    const trainlines = thunkAPI.getState().trainroutes.trainlineList;
    let velorouteStops = addXYValues(veloroute);
    velorouteStops = makeTrainlinesArray(velorouteStops);
    const velorouteStopsGrouped = groupVeloroute(velorouteStops, trainlines);
    const path = getRoutePath(velorouteStopsGrouped);
    const route = makeVeloRoute(velorouteStopsGrouped);

    return {
      id,
      name,
      len,
      route,
      path
    }
  }
);

export const loadCrossingVeloroutes = createAsyncThunk(
  "veloroutes/setCrossingVelorouteList",
  async (idx, thunkAPI) => {
    //const activeVelorouteSectionIds = thunkAPI.getState().veloroutes.activeVeloroute.route[idx].leg.map(s => s.stop_id);
    // const trainlines = thunkAPI.getState().trainroutes.trainlineList;
    // const activeVelorouteSection = thunkAPI.getState().veloroutes.activeVelorouteSection;

    // const veloroutesQuery = 'veloroutes/ids[]=' + activeVelorouteIds.join('&ids[]=');
    // const veloroutes = await fetch(`${url}${veloroutesQuery}`, {'headers': headers})
    // .then(response => response.json());

    // const velorouteStops = veloroutes.filter(stop => stop.veloroute_id !== activeVelorouteId).map(refactorStopData);
    // let refactoredJourneys = allocateVeloroutestopsToRoute(velorouteStops, trainlines);
    // refactoredJourneys = generateCrossingVeloroutes(activeVelorouteSection, refactoredJourneys);

    // return refactoredJourneys
  }
);

export const setVelorouteSectionActiveThunk = (idx) => {
  return dispatch => {
    dispatch(setActiveVelorouteSection(idx));
    dispatch(setActiveSection(null));
    dispatch(loadTrainroutesAlongVeloroute(idx));
  };
};

/**
 * activeVeloroute
 * id: string, 
 * name: string,
 * len: number,
 * route: { stop_id: string, stop_name: string, x: number, y: number, lat: number, lon: number }[][],
 * path: string
 */
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
      [loadVeloroute.pending]: (state, action) => {
        state.isLoading = true;
        state.hasError = false;
      },
      [loadVeloroute.fulfilled]: (state, action) => {
        state.activeVeloroute = action.payload;
        state.isLoading = false;
        state.hasError = false;
      },
      [loadVeloroute.rejected]: (state, action) => {
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