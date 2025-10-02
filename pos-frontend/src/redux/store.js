/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import noteSlice from "./slices/noteSlice";
import discountSlice from "./slices/discountSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
    cart: cartSlice,
    user: userSlice,
    note: noteSlice,
    discount: discountSlice,
  },

  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
