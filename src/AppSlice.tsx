import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { headers, url } from "./config/config.tsx";

export const loadLang = createAsyncThunk("app/loadLang", async () => {
    const query = "lang";
    const lang = await fetch(`${url}${query}`, { headers: headers })
        .then((response) => {
            if (response.status !== 200) {
                throw new Error("Bad Server Response");
            }
            return response.json();
        })
        .then((JSONresponse) => {
            type LangType = { id: string; de: string; en: string };
            const obj = {
                de: {} as Record<string, string>,
                en: {} as Record<string, string>,
            };
            JSONresponse.forEach((el: LangType) => {
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
    },
    reducers: {
        setTheme: (state, action) => {
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

export const selectLang = (state: {
    app: ReturnType<typeof appSlice.reducer>;
}) => state.app.lang;
export const selectTheme = (state: {
    app: ReturnType<typeof appSlice.reducer>;
}) => state.app.theme;
export const selectLangLoading = (state: {
    app: ReturnType<typeof appSlice.reducer>;
}) => state.app.langLoading;
export const selectLangError = (state: {
    app: ReturnType<typeof appSlice.reducer>;
}) => state.app.langError;

export const { setTheme } = appSlice.actions;

export default appSlice.reducer;
