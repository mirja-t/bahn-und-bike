import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "../../config/config";
import type { RootState } from "../../store";

export type ActiveDestination = {
    id: string;
    name: string;
    lat: number;
    lon: number;
};
export interface DestinationsState {
    activeDestinations: ActiveDestination[] | null;
    destinationsLoading: boolean;
    destinationsError: boolean;
}

export const loadDestinations = createAsyncThunk<
    ActiveDestination[],
    { ids: string[] },
    { state: RootState }
>("destinations/setDestination", async ({ ids }) => {
    const destinationQuery = "destinations/ids[]=" + ids.join("&ids[]=");
    const destination: ActiveDestination[] = await fetch(
        `${VITE_API_URL}${destinationQuery}`,
        {
            headers: headers,
        },
    ).then((response) => {
        if (response.status !== 200) {
            throw new Error("Bad Server Response");
        }
        return response.json();
    });

    return destination;
});

export const destinationsSlice = createSlice({
    name: "destinations",
    initialState: {
        activeDestinations: null,
        destinationsLoading: false,
        destinationsError: false,
    } as DestinationsState,
    reducers: {},
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

export default destinationsSlice.reducer;
