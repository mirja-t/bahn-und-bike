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
        const obj = {
          de: {},
          en: {}
        };
        JSONresponse.forEach(el => {
          obj.de[el.id] = el.de 
          obj.en[el.id] = el.en
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
        langError: false
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

export const selectLang = (state) => state.app.lang;
export const selectLangLoading = (state) => state.app.langLoading;
export const selectLangError = (state) => state.app.langError;

export default appSlice.reducer;