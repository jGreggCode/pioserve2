const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, requried: true },
      guests: { type: Number, required: true },
    },
    orderStatus: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      required: true,
    },
    bills: {
      total: { type: Number, required: true },
      tax: { type: Number, required: true },
      totalWithTax: { type: Number, required: true },
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [],
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: false,
    },
    isTakeOut: { type: Boolean, default: false },
    paymentMethod: String,
    paymentData: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
