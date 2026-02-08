import { configureStore, createSlice } from "@reduxjs/toolkit";

export const mockSlice = createSlice({
    name: "app",
    initialState: {
        theme: "light",
        lang: "en",
    },
    reducers: {
        setTheme: (state, action: { payload: string }) => {
            state.theme = action.payload;
        },
        setLang: (state, action: { payload: string }) => {
            state.lang = action.payload;
        },
    },
});

// Mock Redux store for Storybook
const mockStore = configureStore({
    reducer: {
        app: mockSlice.reducer,
    },
    preloadedState: {
        app: {
            theme: "light",
            lang: "en",
        },
    },
});

export { mockStore };
