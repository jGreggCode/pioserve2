import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  updateTable,
  updateOrderItems, // ✅ add this in https/index.js
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import { useNavigate } from "react-router-dom";
import Invoice from "../invoice/Invoice";

const Bill = ({ editMode = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25; // Change this to upate the tax
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();

  console.log(customerData);

  const handlePlaceOrder = () => {
    if (cartData.length === 0) {
      enqueueSnackbar("No items in the cart!", { variant: "warning" });
      return;
    }

    if (editMode) {
      // 🔹 Update items only
      const updateData = {
        orderId: customerData.orderId,
        items: cartData,
        bills: {
          total,
          tax,
          totalWithTax: totalPriceWithTax,
        },
      };
      updateMutation.mutate(updateData);
    } else {
      // 🔹 Create new order
      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        orderDate: new Date().toISOString(),
        bills: {
          total,
          tax,
          totalWithTax: totalPriceWithTax,
        },
        employee: userData._id,
        items: cartData,
        table: customerData.table.tableId,
        paymentMethod,
      };
      orderMutation.mutate(orderData);
    }
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      setOrderInfo(data);

      // 🔹 Update the table to "Booked" with the new orderId
      tableUpdateMutation.mutate({
        tableId: customerData.table.tableId,
        status: "Booked",
        orderId: data._id,
      });

      dispatch(removeCustomer());
      dispatch(removeAllItems());
      setPaymentMethod("Cash");
      setOrderInfo(undefined);
      setShowInvoice(false);
      enqueueSnackbar("Order Placed!", { variant: "success" });
      navigate("/orders");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (reqData) => updateOrderItems(reqData),
    onSuccess: (resData) => {
      setOrderInfo(resData.data);
      enqueueSnackbar("Order Updated!", { variant: "success" });

      // 🔹 Keep table linked to updated order
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
    onSuccess: (resData) => {
      // console.log(resData);
      setTableInfo(resData.data); // ✅ Store the table response
      dispatch(removeCustomer());
      dispatch(removeAllItems());

      navigate("/orders");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleCancel = () => {
    dispatch(removeCustomer());
    dispatch(removeAllItems());
    setPaymentMethod("Cash");
    setOrderInfo(undefined);
    setShowInvoice(false);

    enqueueSnackbar("Order Edit Cancel", { variant: "success" });
    navigate("/");
  };

  return (
    <>
      {/* Order Summary */}
      <div className="px-5 mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#ababab]">Items ({cartData.length})</p>
          <h1 className="text-[#f5f5f5] text-base font-semibold">
            ₱{total.toFixed(2)}
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#ababab]">Tax ({taxRate}%)</p>
          <h1 className="text-[#f5f5f5] text-base font-semibold">
            ₱{tax.toFixed(2)}
          </h1>
        </div>
        <div className="flex items-center justify-between border-t border-[#2a2a2a] pt-3">
          <p className="text-sm text-[#e4e4e4] font-medium">Total with Tax</p>
          <h1 className="text-lg font-bold text-primary">
            ₱{totalPriceWithTax.toFixed(2)}
          </h1>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex items-center gap-3 px-5 mt-5">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`w-full rounded-lg px-4 py-3 font-semibold transition ${
            paymentMethod === "Cash"
              ? "bg-[#383737] text-[#f5f5f5]"
              : "bg-[#1f1f1f] text-[#ababab] hover:bg-[#2a2a2a] hover:text-white"
          }`}
        >
          Cash
        </button>
      </div>

      {/* Place/Update Order */}
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={handlePlaceOrder}
          className="bg-primary px-4 py-3 w-full rounded-lg text-[#1f1f1f] font-semibold text-lg hover:bg-accent transition"
        >
          {editMode ? "Update Order" : "Place Order"}
        </button>
      </div>

      {/* Cancel (edit mode only) */}
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

      {/* Invoice Modal */}
      {showInvoice && orderInfo && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}
    </>
  );
};

export default Bill;
