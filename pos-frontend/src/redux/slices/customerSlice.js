import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderId: "",
  customerName: "",
  customerPhone: "",
  guests: 0,
  table: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests } = action.payload;
      state.orderId = `${Date.now()}`;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
    },

    setCustomerFromOrder: (state, action) => {
      const { orderId, customerDetails, table } = action.payload;
      state.orderId = orderId;
      state.customerName = customerDetails.name;
      state.customerPhone = customerDetails.phone;
      state.guests = customerDetails.guests;
      state.table = table;
    },

    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
    },

    updateTable: (state, action) => {
      state.table = action.payload.table;
    },
  },
});

export const {
  setCustomer,
  setCustomerFromOrder,
  removeCustomer,
  updateTable,
} = customerSlice.actions;
export default customerSlice.reducer;
