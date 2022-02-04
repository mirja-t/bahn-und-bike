import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { refactorVeloroutes } from '../../../utils/refactorVeloroutes';
import { headers, url } from '../../../config/config';

export const loadVeloroutes = createAsyncThunk(
  "veloroutes/setVelorouteList",
  async (activeIds, thunkAPI) => {
    const destinations = thunkAPI.getState().destinationDetails.destinationList;

    const veloroutesQuery = 'veloroutes/ids[]=' + activeIds.join('&ids[]=');
      
    const veloroutes = await fetch(`${url}${veloroutesQuery}`, {'headers': headers})
    .then(response => response.json());

    const velorouteIds = [...new Set(veloroutes.map(s => s.veloroute_id))];
    const velorouteIdsQuery = 'veloroutestops/ids[]=' + velorouteIds.join('&ids[]=');

    const journeys = await fetch(`${url}${velorouteIdsQuery}`, {'headers': headers})
    .then(response => response.json());

    const refactoredJourneys = refactorVeloroutes(journeys, destinations)

    return refactoredJourneys
  }
);

export const veloroutesSlice = createSlice({
    name: "veloroutes",
    initialState: {
        velorouteList: [],
        isLoading: false,
        hasError: false,
        activeVeloroute: null,
        activeVelorouteSection: null,
        activeVelorouteStop: null
    },
    reducers: {
      setActiveVeloroute: (state, action) => {
        state.activeVeloroute = action.payload
      },
      setActiveVelorouteSection: (state, action) => {
        state.activeVelorouteSection = action.payload
      },
      setActiveVelorouteStop: (state, action) => {
        state.activeVelorouteStop = action.payload
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
      }
    }
  });

export const selectVelorouteList = (state) => state.veloroutes.velorouteList;
export const selectActiveVeloroute = (state) => state.veloroutes.activeVeloroute;
export const selectActiveVelorouteSection = (state) => state.veloroutes.activeVelorouteSection;
export const selectActiveVelorouteStop = (state) => state.veloroutes.activeVelorouteStop;

export const {
    setActiveVeloroute,
    setActiveVelorouteSection,
    setActiveVelorouteStop
} = veloroutesSlice.actions;

 export default veloroutesSlice.reducer;