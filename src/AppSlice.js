import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { headers, url } from './config/config';

export const loadLang = createAsyncThunk(
    "app/loadLang",
    async () => {

      const query = 'lang';
      const lang = await fetch(`${url}${query}`, {'headers': headers})
      .then(response => {
        if (response.status !== 200) { throw new Error("Bad Server Response"); }
        return response.json()
      })
      .then(JSONresponse => {
        const obj = {};
        JSONresponse.forEach(el => {
          obj[el.id] = {
              en: el.en,
              de: el.de
          }
        })
        return obj
      });
      return lang
});

export const appSlice = createSlice({
    name: "app",
    initialState: {
        lang: {},
        langLoading: true,
        langError: false,
        loadingSequenceActive: true
    },
    reducers: {
      setLoadingSequenceActive: (state, action) => {
        state.loadingSequenceActive = action.payload;
      }
    },
    extraReducers: {
        [loadLang.pending]: (state, action) => {
          state.langLoading = true;
          state.langError = false;
        },
        [loadLang.fulfilled]: (state, action) => {
          state.lang = action.payload;
          state.langLoading = false;
          state.langError = false;
        },
        [loadLang.rejected]: (state, action) => {
          state.langLoading = false;
          state.langError = true;
        }
        
      }
  });

export const {
  setLoadingSequenceActive
} = appSlice.actions;

export const selectLang = (state) => state.app.lang;
export const selectLangLoading = (state) => state.app.langLoading;
export const selectLangError = (state) => state.app.langError;
export const selectLoadingSequenceActive = (state) => state.app.loadingSequenceActive;


export default appSlice.reducer;