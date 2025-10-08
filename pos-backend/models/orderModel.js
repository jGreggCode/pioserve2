/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Senior", "PWD"],
      required: true,
    },
    cardId: {
      type: String,
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      guests: { type: Number, required: true },
    },
    discounts: [discountSchema], // ✅ store array of discounts applied
    orderStatus: {
      type: String,
      required: true,
      enum: ["In Progress", "Ready", "Completed", "Cancelled"],
      default: "In Progress",
    },
    orderDate: {
      type: Date,
      required: true,
    },
    bills: {
      total: { type: Number, required: true },
      discountAmount: { type: Number, default: 0 },
      discountPercent: { type: Number, default: 0 },
      tax: { type: Number, required: true },
      totalWithTax: { type: Number, required: true },
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: {
      type: Array,
      required: true,
      default: [],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: false,
    },
    note: { type: String, default: "None" },
    isTakeOut: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "Gcash"],
      default: "Cash",
    },
    paymentData: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
