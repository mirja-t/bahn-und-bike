import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { headers, url } from '../../../config/config';
import { refactorStopData } from '../../../utils/refactorStopData';
import { generateTrainlineTree } from '../../../utils/treeData/generateTrainlineTree'; 
import { generateTrainlines } from '../../../utils/treeData/generateTrainlines'; 
import { generateTrainList } from '../../../utils/generateTrainList';

export const loadTrainroutes = createAsyncThunk(
    "trainroutes/setTrainroutes",
    async ({start, value, direct}, thunkAPI) => {
      const connectionsQuery = direct ? 'trainstops/' + start : 'connections/' + start;
      const connections = await fetch(`${url}${connectionsQuery}`, {'headers': headers})
      .then(response => {
        if (response.status !== 200) { throw new Error("Bad Server Response"); }
        return response.json()
      });
      const trainstopsRefactored = connections.map(refactorStopData);
      const startStops = trainstopsRefactored.filter(s => s.stop_id === start);
      const trainrouteList = generateTrainlines(trainstopsRefactored);
      const trainlines = generateTrainList(trainrouteList);
      const [trainrouteTree, currentTrainroutes] = generateTrainlineTree(trainrouteList, startStops, value, direct);
      
      thunkAPI.dispatch(setTrainlineList(trainlines));
      thunkAPI.dispatch(setCurrentTrainroutes(currentTrainroutes));

      return trainrouteTree
});

export const trainroutesSlice = createSlice({
    name: "trainroutes",
    initialState: {
        startPos: '8011160',
        travelInterval: 30,
        trainrouteTree: {},
        trainlineList: [],
        currentTrainroutes: [],
        trainroutesLoading: false,
        trainroutesError: false,
        activeSpot: null,
        activeSection: null,
        trainlinesAlongVeloroute: []
    },
    reducers: {
      setCurrentTrainroutes: (state, action) => {
        state.currentTrainroutes = action.payload;
      },
      setTrainlineList: (state, action) => {
        state.trainlineList = action.payload;
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
          state.trainroutesLoading = true;
          state.trainroutesError = false;
        },
        [loadTrainroutes.fulfilled]: (state, action) => {
          state.trainrouteTree = action.payload;
          state.trainroutesLoading = false;
          state.trainroutesError = false;
        },
        [loadTrainroutes.rejected]: (state, action) => {
          state.trainroutesLoading = false;
          state.trainroutesError = true;
        }
      }
});

export const selectTrainrouteList = (state) => state.trainroutes.trainrouteTree;
export const selectActiveSpot = (state) => state.trainroutes.activeSpot;
export const selectActiveSection = (state) => state.trainroutes.activeSection;
export const selectTrainlinesAlongVeloroute = (state) => state.trainroutes.trainlinesAlongVeloroute;
export const selectTrainrouteListLoading = (state) => state.trainroutes.trainroutesLoading;
export const selectTrainlinesAlongVelorouteLoading = (state) => state.trainroutes.trainlinesAlongVelorouteLoading;
export const selectStartPos = (state) => state.trainroutes.startPos;
export const selectCurrentTrainroutes = (state) => state.trainroutes.currentTrainroutes;
export const selectTrainlineList = (state) => state.trainroutes.trainlineList;


export const {
    setActiveSpot,
    setActiveSection,
    setTrainLinesAlongVeloroute,
    setStartPos,
    setCurrentTrainroutes,
    setTrainlineList
} = trainroutesSlice.actions;

export default trainroutesSlice.reducer;