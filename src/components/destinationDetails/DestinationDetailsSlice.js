import { createSlice } from '@reduxjs/toolkit';

export const destinationDetailsSlice = createSlice({
    name: "destinationDetails",
    initialState: {
        destinationList: {},
        activeDestination: {
            id: null,
            stop_name: null,
            trainlines: []
        }
    },
    reducers: {
        setDestinations: (state, action) => {
            action.payload.forEach(s => {
                if(!state.destinationList[s.destination_id]) {
                    state.destinationList[s.destination_id] = {
                        stop_name: s.dest_name,
                        trainlines: [s.name]
                    }
                }
                else { 
                    if (!state.destinationList[s.destination_id].trainlines.includes(s.name)) 
                        state.destinationList[s.destination_id].trainlines.push(s.name) 
                }                
            })
        },
        setActiveDestination: (state, action) => {

            if(!action.payload) {
                state.activeDestination = {
                    id: null,
                    stop_name: null,
                    trainlines: []
                }
            }
            else {
                state.activeDestination = state.destinationList[action.payload];
                state.activeDestination.id = action.payload;
            }
        }
    }
});

export const selectActiveDestinationId = (state) => state.destinationDetails.activeDestination.id;
export const selectActiveDestination = (state) => state.destinationDetails.activeDestination;

export const {
    setDestinations,
    setActiveDestination
} = destinationDetailsSlice.actions;

 export default destinationDetailsSlice.reducer;