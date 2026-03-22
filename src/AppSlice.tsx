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
export type TabIds = "trainlines" | "veloroutes" | "leg";

export interface AppState {
    lang: Labels;
    langCode: LangCode;
    theme: Theme;
    activeTab: TabIds;
    langLoading: boolean;
    langError: boolean;
    userScale: number;
}

export const appSlice = createSlice({
    name: "app",
    initialState: {
        langCode: LangCode.DE,
        theme: Theme.Light,
        activeTab: "trainlines",
        langLoading: false,
        langError: false,
        userScale: 1,
    } as AppState,
    reducers: {
        setTheme: (state, action: { payload: Theme }) => {
            state.theme = action.payload;
        },
        setLangCode: (state, action: { payload: LangCode }) => {
            state.langCode = action.payload;
        },
        setActiveTab: (state, action: { payload: TabIds }) => {
            state.activeTab = action.payload;
        },
        setUserScale: (state, action: { payload: number | "reset" }) => {
            if (action.payload === "reset") {
                state.userScale = 1;
            } else if (typeof state.userScale === "number") {
                state.userScale = state.userScale + action.payload;
            }
        },
    },
});

export const selectTheme = (state: RootState) => state.app.theme;
export const selectLangCode = (state: RootState) => state.app.langCode;
export const selectActiveTab = (state: RootState) => state.app.activeTab;
export const selectUserScale = (state: RootState) => state.app.userScale;

export const { setTheme, setLangCode, setActiveTab, setUserScale } =
    appSlice.actions;

export default appSlice.reducer;
export const useAppDispatch: () => AppDispatch = useDispatch;
