/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItems: (state, action) => {
      const newItem = {
        ...action.payload,
        note: action.payload.note ?? "",
        isExisting: action.payload.isExisting ?? false, // ✅ default false if not provided
      };

      // find existing item with same id and same isExisting flag
      const existingItem = state.find(
        (item) =>
          item.id === newItem.id && item.isExisting === newItem.isExisting
      );

      if (existingItem) {
        // update quantity & price for same type of item
        existingItem.quantity += newItem.quantity;
        existingItem.price += newItem.pricePerQuantity * newItem.quantity;
      } else {
        state.push(newItem);
      }
    },

    removeItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },

    removeAllItems: () => {
      return [];
    },

    setItemNote: (state, action) => {
      const { id, note } = action.payload;
      const item = state.find((item) => item.id === id);
      if (item) item.note = note;
    },
  },
});

export const getTotalPrice = (state) =>
  state.cart.reduce((total, item) => total + item.price, 0);

export const { addItems, removeItem, removeAllItems, setItemNote } =
  cartSlice.actions;

export default cartSlice.reducer;
