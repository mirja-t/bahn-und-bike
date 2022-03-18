import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { headers, url } from '../../../config/config';
import { distributeTrainlines } from '../../../utils/distributeTrainlines';
import { allocateTrainstopsToRoute } from '../../../utils/allocateTrainstopsToRoute';
import { processDestinationData } from '../../../utils/processDestinationData';
import { setDestinations } from '../../destinationDetails/DestinationDetailsSlice';

export const loadTrainroutes = createAsyncThunk(
    "trainroutes/setTrainroutes",
    async ({start}, ThunkAPI) => {
      const trainlinesQuery = 'trainlines/ids[]=' + start.join('&ids[]=');
      const trainlines = await fetch(`${url}${trainlinesQuery}`, {'headers': headers})
      .then(response => {
        if (response.status !== 200) { throw new Error("Bad Server Response"); }
        return response.json()
      });

      const trainlineIds = [...new Set(trainlines.map(s => s.trainline_id))];
      const trainroutesQuery = 'trainroutes/ids[]=' + trainlineIds.join('&ids[]=');

      const trainstops = await fetch(`${url}${trainroutesQuery}`, {'headers': headers})
      .then(response => response.json());

      distributeTrainlines(trainstops);
      const trainroutes = allocateTrainstopsToRoute(trainlineIds, trainstops, start);
      const destinations = processDestinationData(trainstops);
      ThunkAPI.dispatch(setDestinations(destinations));
      return trainroutes
});

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: ['8011160', '8098160', '8011306', '8011118', '8011113', '8011102', '8011162', '8010036'],
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