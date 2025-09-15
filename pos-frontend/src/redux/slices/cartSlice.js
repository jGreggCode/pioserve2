/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
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
      const newItem = action.payload;

      // find existing item by its id
      const existingItem = state.find((item) => item.id === newItem.id);

      if (existingItem) {
        // update quantity & price
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
  },
});

export const getTotalPrice = (state) =>
  state.cart.reduce((total, item) => total + item.price, 0);

export const { addItems, removeItem, removeAllItems } = cartSlice.actions;
export default cartSlice.reducer;
