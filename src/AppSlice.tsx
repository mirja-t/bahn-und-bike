import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, VITE_API_URL } from "./config/config.tsx";
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
    currentLang: LangCode;
    theme: Theme;
    langLoading: boolean;
    langError: boolean;
}

export const loadLang = createAsyncThunk("app/loadLang", async () => {
    // const { default: lang } = await import("./i18n/lang.json");
    const query = "lang";
    const lang = await fetch(`${VITE_API_URL}${query}`, { headers: headers })
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("Bad Server Response");
            }
            return response.json();
        })
        .then((JSONresponse) => {
            const obj = {
                de: {} as Record<string, string>,
                en: {} as Record<string, string>,
            };
            JSONresponse.forEach((el: Lang) => {
                obj.de[el.id] = el.de;
                obj.en[el.id] = el.en;
            });
            return obj;
        });
    return lang;
});

export const appSlice = createSlice({
    name: "app",
    initialState: {
        lang: {},
        currentLang: LangCode.DE,
        theme: Theme.Light,
        langLoading: true,
        langError: false,
    } as AppState,
    reducers: {
        setTheme: (state, action: { payload: Theme }) => {
            state.theme = action.payload;
        },
        setLang: (state, action: { payload: LangCode }) => {
            state.currentLang = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadLang.pending, (state) => {
                state.langLoading = true;
                state.langError = false;
            })
            .addCase(loadLang.fulfilled, (state, action) => {
                state.lang = action.payload;
                state.langLoading = false;
                state.langError = false;
            })
            .addCase(loadLang.rejected, (state) => {
                state.langLoading = false;
                state.langError = true;
            });
    },
});

export const selectLang = (state: RootState) => state.app.lang;
export const selectTheme = (state: RootState) => state.app.theme;
export const selectLangLoading = (state: RootState) => state.app.langLoading;
export const selectLangError = (state: RootState) => state.app.langError;
export const selectCurrentLang = (state: RootState) => state.app.currentLang;

export const { setTheme, setLang } = appSlice.actions;

export default appSlice.reducer;
export const useAppDispatch: () => AppDispatch = useDispatch;
