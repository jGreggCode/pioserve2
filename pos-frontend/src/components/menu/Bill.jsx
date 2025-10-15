/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice, removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import { clearNote } from "../../redux/slices/noteSlice";
import { clearDiscount } from "../../redux/slices/discountSlice";
import { addOrder, updateTable, updateOrderItems } from "../../https/index";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Invoice from "../invoice/Invoice";

const Bill = ({ editMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const note = useSelector((state) => state.note);
  const userData = useSelector((state) => state.user);
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const discounts = useSelector((state) => state.discount);
  const total = useSelector(getTotalPrice);
  const guests = customerData?.guests || 1;

  // --- TAX SETUP ---
  const taxRate = 0; // %
  const tax = (total * taxRate) / 100;

  // --- DISCOUNT COMPUTATION ---
  let discountAmount = 0;
  let discountPercent = 0;

  if (discounts.length > 0) {
    const maxDiscountValue = Math.max(
      ...discounts.map((d) => parseFloat(d.discountValue) || 0)
    );
    discountPercent = maxDiscountValue;

    const perHead = total / guests;
    const validIds = discounts.length;
    discountAmount = perHead * (maxDiscountValue / 100) * validIds;
  }

  const discountedTotal = total - discountAmount;
  const totalPriceWithTax = discountedTotal + (discountedTotal * taxRate) / 100;

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

  // --- MUTATIONS ---
  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);

      tableUpdateMutation.mutate({
        tableId: customerData.table.tableId,
        status: "Booked",
        orderId: data._id,
      });

      dispatch(removeCustomer());
      dispatch(removeAllItems());
      dispatch(clearNote());
      dispatch(clearDiscount());
      enqueueSnackbar("Order Placed!", { variant: "success" });
      navigate("/orders");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (reqData) => updateOrderItems(reqData),
    onSuccess: (resData) => {
      setOrderInfo(resData.data);
      enqueueSnackbar("Order Updated!", { variant: "success" });

      tableUpdateMutation.mutate({
        tableId: customerData.table.tableId,
        status: "Booked",
        orderId: customerData.orderId,
      });

      navigate("/orders");
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onError: (error) => console.log(error),
  });

  // --- HANDLE PLACE ORDER ---
  const handlePlaceOrder = () => {
    if (cartData.length === 0) {
      enqueueSnackbar("No items in the cart!", { variant: "warning" });
      return;
    }

    const bills = {
      total,
      discountAmount,
      discountPercent,
      tax,
      totalWithTax: totalPriceWithTax,
    };

    if (editMode) {
      const updateData = {
        orderId: customerData.orderId,
        items: cartData,
        note,
        bills,
        discounts, // ✅ added discounts array to update as well
      };
      updateMutation.mutate(updateData);
    } else {
      const orderData = {
        customerDetails: {
          name: customerData.customerName || "N/A",
          phone: customerData.customerPhone || "N/A",
          guests,
        },
        discounts, // ✅ send discount array to backend
        orderStatus: "In Progress",
        orderDate: new Date().toISOString(),
        bills,
        employee: userData._id,
        items: cartData,
        table: customerData.table?.tableId || null,
        paymentMethod,
        note,
      };
      orderMutation.mutate(orderData);
    }
  };

  const handleCancel = () => {
    dispatch(removeCustomer());
    dispatch(removeAllItems());
    dispatch(clearDiscount());
    enqueueSnackbar("Order Edit Cancelled", { variant: "info" });
    navigate("/");
  };

  return (
    <>
      {/* --- ORDER SUMMARY --- */}
      <div className="px-4 sm:px-6 md:px-8 mt-4 space-y-3 text-[#f5f5f5]">
        <div className="flex items-center justify-between">
          <p className=" text-[#ababab]">Items ({cartData.length})</p>
          <h1 className="text-[#f5f5f5] text-base font-semibold">
            ₱{total.toFixed(2)}
          </h1>
        </div>

        {discounts.length > 0 && (
          <div className="flex items-center justify-between">
            <p className=" text-[#ababab]">
              Discount ({discountPercent}% × {discounts.length} ID
              {discounts.length > 1 ? "s" : ""})
            </p>
            <h1 className="text-[#4ade80] text-base font-semibold">
              -₱{discountAmount.toFixed(2)}
            </h1>
          </div>
        )}

        {/* <div className="flex items-center justify-between">
          <p className="text-[#ababab]">Tax ({taxRate}%)</p>
          <h1 className="text-[#f5f5f5] text-base font-semibold">
            ₱{((discountedTotal * taxRate) / 100).toFixed(2)}
          </h1>
        </div> */}

        <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-3">
          <p className="text-[#e4e4e4] font-medium">Total</p>
          <h1 className="text-lg font-bold text-primary">
            ₱{totalPriceWithTax.toFixed(2)}
          </h1>
        </div>
      </div>

      {/* --- PAYMENT METHOD --- */}
      <div className="flex flex-wrap gap-3 px-4 mt-5 sm:px-6 md:px-8">
        {["Cash", "Gcash", "Card"].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`w-full rounded-lg px-4 py-3 font-semibold transition ${
              paymentMethod === method
                ? "bg-[#383737] text-[#f5f5f5]"
                : "bg-[#1f1f1f] text-[#ababab] hover:bg-[#2a2a2a] hover:text-white"
            }`}
          >
            {method === "Gcash" ? (
              <img
                src="/gcash.png"
                className="object-contain h-6 mx-auto"
                alt="Gcash"
              />
            ) : (
              method
            )}
          </button>
        ))}
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handlePlaceOrder}
          className="bg-primary w-full py-3 sm:py-4 md:py-5 rounded-xl text-[#1f1f1f] font-semibold text-base sm:text-lg md:text-xl hover:bg-accent transition"
        >
          {editMode ? "Update Order" : "Place Order"}
        </button>
      </div>

      {editMode && (
        <div className="flex items-center gap-3 px-5 mt-3">
          <button
            onClick={handleCancel}
            className="bg-[#fa1717] px-4 py-3 w-full rounded-lg text-white font-semibold text-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* --- INVOICE --- */}
      {showInvoice && orderInfo && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;
