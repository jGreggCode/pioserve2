/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = []; // will hold [{ type: 'Senior', cardId: 'xxx' }, ...]

const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    setDiscount: (state, action) => {
      // replace all discounts at once
      return action.payload;
    },
    addDiscount: (state, action) => {
      // push a new discount row
      state.push(action.payload);
    },
    clearDiscount: () => {
      return [];
    },
  },
});

export const { setDiscount, addDiscount, clearDiscount } =
  discountSlice.actions;
export default discountSlice.reducer;
