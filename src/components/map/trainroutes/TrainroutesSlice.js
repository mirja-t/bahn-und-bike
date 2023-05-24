import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { headers, url } from '../../../config/config';
import { refactorStopData } from '../../../utils/refactorStopData';
import { generateTrainlineTree } from '../../../utils/treeData/generateTrainlineTree'; 
import { generateTrainlines } from '../../../utils/generateTrainlines'; 
import { makeTrainConnection } from '../../../utils/makeTrainConnection';

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
      const currentTrainroutes = generateTrainlineTree(trainrouteList, startStops, value, direct);

      const trainlineList = direct ? startStops.map(s => s.trainline_id) : null;
      thunkAPI.dispatch(setTrainlineList(trainlineList));

      return currentTrainroutes
});

export const loadTrainroutesAlongVeloroute = createAsyncThunk(
  "trainroutes/setTrainroutesAlongVeloroute",
  async (idx, thunkAPI) => {

    const startdestination = thunkAPI.getState().trainroutes.startPos;
    const activeVeloroute = thunkAPI.getState().veloroutes.activeVeloroute;
    const startId = activeVeloroute.route[idx].leg[0].trainstop;
    const endId = activeVeloroute.route[idx].leg[activeVeloroute.route[idx].leg.length - 1].trainstop;

    const  connections = [];
    const fetchConnection = async id => {
      const connectionQuery = 'connection/' + startdestination + '&' + id;
      const connection = await fetch(`${url}${connectionQuery}`, {'headers': headers})
      .then(response => {
        if (response.status !== 200) { throw new Error("Bad Server Response"); }
        return response.json()
      });
      return connection
    }

    const connectionStart = await fetchConnection(startId);
    const connectionEnd = await fetchConnection(endId);
    connections.push(makeTrainConnection(connectionStart));
    connections.push(makeTrainConnection(connectionEnd));

    return connections
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
        trainlinesAlongVeloroute: [],
        trainroutesAlongVelorouteLoading: false,
        trainroutesAlongVelorouteError: false,
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
          state.currentTrainroutes = action.payload;
          state.trainroutesLoading = false;
          state.trainroutesError = false;
        },
        [loadTrainroutes.rejected]: (state, action) => {
          state.trainroutesLoading = false;
          state.trainroutesError = true;
        },
        [loadTrainroutesAlongVeloroute.pending]: (state, action) => {
          state.trainroutesAlongVelorouteLoading = true;
          state.trainroutesAlongVelorouteError = false;
        },
        [loadTrainroutesAlongVeloroute.fulfilled]: (state, action) => {
          state.trainlinesAlongVeloroute = action.payload;
          state.trainroutesAlongVelorouteLoading = false;
          state.trainroutesAlongVelorouteError = false;
        },
        [loadTrainroutesAlongVeloroute.rejected]: (state, action) => {
          state.trainroutesAlongVelorouteLoading = false;
          state.trainroutesAlongVelorouteError = true;
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