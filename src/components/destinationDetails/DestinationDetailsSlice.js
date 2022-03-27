import { createSlice } from '@reduxjs/toolkit';

export const destinationDetailsSlice = createSlice({
    name: "destinationDetails",
    initialState: {
        destinationList: {}
    },
    reducers: {
        setDestinationList: (state, action) => {
            action.payload.forEach(s => {
                if(!state.destinationList[s.destination_id]) {
                    state.destinationList[s.destination_id] = {};
                    state.destinationList[s.destination_id].trainlineList = []
                }
                state.destinationList[s.destination_id].trainlineList.push(s.trainline_id);
            });
        }
    }
});

export const selectDestinationList = (state) => state.destinationDetails.destinationList;
export const selectActiveDestination = (state) => state.destinationDetails.activeDestination;

export const {
    setDestinationList,
    setActiveDestination
} = destinationDetailsSlice.actions;

export default destinationDetailsSlice.reducer;