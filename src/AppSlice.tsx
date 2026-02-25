import { createSlice } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./store";
import { useDispatch } from "react-redux";

export const Theme = {
    Light: "light",
    Dark: "dark",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

export const LangCode = {
    DE: "de",
    EN: "en",
} as const;
export type LangCode = (typeof LangCode)[keyof typeof LangCode];

export type Labels = Record<LangCode, Record<string, string>>;
export type Lang = { id: string } & { [key in LangCode]: string };

export interface AppState {
    lang: Labels;
    langCode: LangCode;
    theme: Theme;
    langLoading: boolean;
    langError: boolean;
}

export const appSlice = createSlice({
    name: "app",
    initialState: {
        langCode: LangCode.DE,
        theme: Theme.Light,
    } as AppState,
    reducers: {
        setTheme: (state, action: { payload: Theme }) => {
            state.theme = action.payload;
        },
        setLangCode: (state, action: { payload: LangCode }) => {
            state.langCode = action.payload;
        },
    },
});

export const selectTheme = (state: RootState) => state.app.theme;
export const selectLangCode = (state: RootState) => state.app.langCode;

export const { setTheme, setLangCode } = appSlice.actions;

export default appSlice.reducer;
export const useAppDispatch: () => AppDispatch = useDispatch;
