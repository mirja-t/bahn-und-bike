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
    activeDestination: Destination | null;
    activeDestinations: Destination[] | null;
    destinationsLoading: boolean;
    destinationsError: boolean;
}

export const loadDestinations = createAsyncThunk<
    Destination[],
    { ids: string[] },
    { state: RootState }
>("destinations/setDestination", async ({ ids }) => {
    const destinations: Destination[] = await fetch(
        `${VITE_API_URL}destinations`,
        {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ ids }),
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
        activeDestination: null,
        activeDestinations: null,
        destinationsLoading: false,
        destinationsError: false,
    } as DestinationsState,
    reducers: {
        setActiveDestination: (state, action) => {
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
                state.activeDestinations = action.payload;
                state.destinationsLoading = false;
                state.destinationsError = false;
            })
            .addCase(loadDestinations.rejected, (state) => {
                state.destinationsLoading = false;
                state.destinationsError = true;
            });
    },
});

export const selectActiveDestinations = (state: RootState) =>
    state.destinations.activeDestinations;
export const selectActiveDestination = (state: RootState) =>
    state.destinations.activeDestination;

export const { setActiveDestination } = destinationDetailsSlice.actions;
export default destinationDetailsSlice.reducer;
