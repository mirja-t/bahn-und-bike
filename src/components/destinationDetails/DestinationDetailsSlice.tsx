import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../config/config";
import type { RootState } from "../../store";

export type Destination = {
    id: string;
    name: string;
    lat: number;
    lon: number;
    trainstop: boolean;
};
export interface DestinationsState {
    destinations: Destination[] | null;
    destinationsError: boolean;
    destinationsLoading: boolean;
    activeDestination: Destination | null;
    activeDestinationLoading: boolean;
    activeDestinationError: boolean;
}
export const loadDestinations = createAsyncThunk<
    Destination[],
    { population: number },
    { state: RootState }
>("destinations/setDestinations", async ({ population }) => {
    const destinations: Destination[] = await fetch(
        `${VITE_API_URL}destinations?population=${population}`,
        {
            method: "GET",
            headers: headers,
        },
    ).then((response) => {
        if (response.status !== 200) {
            throw new Error("Bad Server Response");
        }
        return response.json();
    });

    return destinations;
});

export const destinationDetailsSlice = createSlice({
    name: "destinations",
    initialState: {
        destinations: null,
        destinationsError: false,
        destinationsLoading: false,
        activeDestination: null,
        activeDestinationLoading: false,
        activeDestinationError: false,
    } as DestinationsState,
    reducers: {
        setActiveDestination: (
            state,
            action: { payload: Destination | null },
        ) => {
            state.activeDestination = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadDestinations.pending, (state) => {
                state.destinationsLoading = true;
                state.destinationsError = false;
            })
            .addCase(loadDestinations.fulfilled, (state, action) => {
                state.destinations = action.payload;
                state.destinationsLoading = false;
                state.destinationsError = false;
            })
            .addCase(loadDestinations.rejected, (state) => {
                state.destinationsLoading = false;
                state.destinationsError = true;
            });
    },
});

export const selectDestinations = (state: RootState) =>
    state.destinations.destinations;
export const selectActiveDestination = (state: RootState) =>
    state.destinations.activeDestination;

export const { setActiveDestination } = destinationDetailsSlice.actions;
export default destinationDetailsSlice.reducer;
