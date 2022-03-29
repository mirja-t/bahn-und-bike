import { createSlice } from '@reduxjs/toolkit';

export const destinationDetailsSlice = createSlice({
    name: "destinations",
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

export const selectDestinationList = (state) => state.destinations.destinationList;

export const {
    setDestinationList
} = destinationDetailsSlice.actions;

export default destinationDetailsSlice.reducer;