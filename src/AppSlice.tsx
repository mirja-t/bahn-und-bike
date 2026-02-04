import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, url } from "./config/config.tsx";
import type { RootState } from "./store.tsx";

export enum Theme {
    Light = "light",
    Dark = "dark",
}
export enum LangCode {
    DE = "de",
    EN = "en",
}
export type Lang = { id: string } & { [key in LangCode]: string };

export interface AppState {
    lang: Record<string, Record<string, string>>;
    theme: Theme;
    langLoading: boolean;
    langError: boolean;
}

export const loadLang = createAsyncThunk<
    Record<string, Record<string, string>>
>("app/loadLang", async () => {
    const query = "lang";
    const lang = await fetch(`${url}${query}`, { headers: headers })
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
        theme: "light",
        langLoading: true,
        langError: false,
    } as AppState,
    reducers: {
        setTheme: (state, action: { payload: Theme }) => {
            state.theme = action.payload;
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

export const { setTheme } = appSlice.actions;

export default appSlice.reducer;
