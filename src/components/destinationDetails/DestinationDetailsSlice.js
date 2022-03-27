import { createSlice } from '@reduxjs/toolkit';

export const destinationDetailsSlice = createSlice({
    name: "destinationDetails",
    initialState: {
        destinationList: {},
        activeDestination: null
    },
    reducers: {
        setDestinations: (state, action) => {
            if(action.payload.add){
                for(let d in action.payload.destinations) {
                    state.destinationList[d] = action.payload.destinations[d]
                }
            }
            else {
                state.destinationList = action.payload.destinations;
            }
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