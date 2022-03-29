import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { headers, url } from '../../../config/config';
import { refactorStopData } from '../../../utils/refactorStopData';
import { allocateTrainstopsToRoute } from '../../../utils/allocateTrainstopsToRoute';
import { setDestinationList } from '../../destinationDetails/destinationDetailsSlice';

export const loadTrainroutes = createAsyncThunk(
    "trainroutes/setTrainroutes",
    async (start, thunkAPI) => {
      const trainlinesQuery = 'trainlines/ids[]=' + start.join('&ids[]=');
      const trainstops = await fetch(`${url}${trainlinesQuery}`, {'headers': headers})
      .then(response => {
        if (response.status !== 200) { throw new Error("Bad Server Response"); }
        return response.json()
      });
      thunkAPI.dispatch(setDestinationList(trainstops));
      const trainstopsRefactored = trainstops.map(refactorStopData);
      const trainroutes = allocateTrainstopsToRoute(trainstopsRefactored, start);
      return trainroutes
});

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: ['8011160', '8011306', '8011118', '8011113', '8011102', '8011162', '8010036'],
        travelInterval: 30,
        trainrouteList: [],
        trainrouteListLoading: false,
        currentTrainroutes: [],
        hasError: false,
        activeSpot: null,
        activeSection: null,
        trainlinesAlongVeloroute: []
    },
    reducers: {
      setCurrentTrainroutes: (state, action) => {
        state.currentTrainroutes = action.payload;
      },
      setActiveSpot: (state, action) => {
        state.activeSpot = action.payload
      },
      setActiveSection: (state, action) => {
        state.activeSection = action.payload;
      },
      setTrainLinesAlongVeloroute: (state, action) => {
        state.trainlinesAlongVeloroute = action.payload;
      },
      setTrainlinesNames: (state, action) => {
        state.trainlineNames = action.payload;
      },
      setStartPos: (state, action) => {
        state.startPos = action.payload;
      }
    },
    extraReducers: {
        [loadTrainroutes.pending]: (state, action) => {
          state.trainrouteListLoading = true;
          state.hasError = false;
        },
        [loadTrainroutes.fulfilled]: (state, action) => {
          state.trainrouteList = action.payload;
          state.trainrouteListLoading = false;
          state.hasError = false;
        },
        [loadTrainroutes.rejected]: (state, action) => {
          state.trainrouteListLoading = false;
          state.hasError = true;
        }
      }
  });

export const selectTrainrouteList = (state) => state.trainroutes.trainrouteList;
export const selectActiveSpot = (state) => state.trainroutes.activeSpot;
export const selectActiveSection = (state) => state.trainroutes.activeSection;
export const selectTrainlinesAlongVeloroute = (state) => state.trainroutes.trainlinesAlongVeloroute;
export const selectTrainrouteListLoading = (state) => state.trainroutes.trainrouteListLoading;
export const selectTrainlinesAlongVelorouteLoading = (state) => state.trainroutes.trainlinesAlongVelorouteLoading;
export const selectStartPos = (state) => state.trainroutes.startPos;
export const selectCurrentTrainroutes = (state) => state.trainroutes.currentTrainroutes;


export const {
    setActiveSpot,
    setActiveSection,
    setTrainLinesAlongVeloroute,
    setCurrentTrainroutes,
    setStartPos
} = trainroutesSlice.actions;

 export default trainroutesSlice.reducer;