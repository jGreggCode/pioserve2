/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { createSlice } from "@reduxjs/toolkit";

const noteSlice = createSlice({
  name: "note",
  initialState: "",
  reducers: {
    setNote: (state, action) => action.payload, // ✅ plain action
    clearNote: () => "", // ✅ plain action
  },
});

export const { setNote, clearNote } = noteSlice.actions;
export default noteSlice.reducer;
