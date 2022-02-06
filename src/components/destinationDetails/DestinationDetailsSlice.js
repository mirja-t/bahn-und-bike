import { createSlice } from '@reduxjs/toolkit';

export const destinationDetailsSlice = createSlice({
    name: "destinationDetails",
    initialState: {
        destinationList: {},
        activeDestination: null
    },
    reducers: {
        setDestinations: (state, action) => {
            state.destinationList = action.payload;
        },
        setActiveDestination: (state, action) => {
            state.activeDestination = action.payload;
        }
    }
});

export const selectDestinationList = (state) => state.destinationDetails.destinationList;
export const selectActiveDestination = (state) => state.destinationDetails.activeDestination;

export const {
    setDestinations,
    setActiveDestination
} = destinationDetailsSlice.actions;

export default destinationDetailsSlice.reducer;