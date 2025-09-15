/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  updateOrderStatus,
  getUserDataById,
  updateTable,
} from "../../https/index";
import { useEffect, useState } from "react";
import { FaCheckDouble, FaLongArrowAltRight, FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import Invoice from "../invoice/Invoice";
import { useDispatch } from "react-redux";
import { setCustomerFromOrder } from "../../redux/slices/customerSlice";
import { removeAllItems, addItems } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const [orderData, setOrderData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),

    onSuccess: (res, variables) => {
      enqueueSnackbar("Order status updated successfully!", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]);
      setShowInvoice(true);

      // ✅ Now use variables.orderStatus
      if (variables.orderStatus === "Paid") {
        tableUpdateMutation.mutate({
          tableId: order.table._id,
          status: "Available",
          orderId: null,
        });
      } else if (variables.orderStatus === "Ready") {
        tableUpdateMutation.mutate({
          tableId: order.table._id,
          status: "Booked",
          orderId: order._id,
        });
      }
    },

    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      // console.log("Table updated:", resData);
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.error("Table update failed:", error);
    },
  });

  const handleStatusChange = async ({ orderId, orderStatus }) => {
    try {
      const employeeRes = await getUserDataById(order.employee);
      const employeeData = employeeRes?.data?.data || null;
      setOrderData({ ...order, employeeData });
      orderStatusUpdateMutation.mutate({ orderId, orderStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditOrder = () => {
    // preload customer slice
    dispatch(
      setCustomerFromOrder({
        orderId: order._id,
        customerDetails: order.customerDetails,
        table: order.table,
      })
    );

    // preload cart slice
    dispatch(removeAllItems());
    order.items.forEach((item) => {
      dispatch(addItems(item));
    });

    navigate(`/menu/${order._id}`);
  };

  return (
    <div className="h-[260px] bg-[#262626] p-4 rounded-lg mb-4">
      <div className="flex items-center gap-5">
        <button className="bg-[#f6b100] p-3 text-xl font-bold rounded-lg">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-[#ababab] text-sm">
              #{Math.floor(new Date(order.orderDate).getTime())} /{" "}
              {order.table ? "Dine In" : "Take Out"}
            </p>
            <p className="text-[#ababab] text-sm">
              {order.table ? `Table ${order.table.tableNo}` : "Take Out"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-600 bg-[#2e4a40] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" />
                  {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-green-600" /> Ready to
                  serve
                </p>
              </>
            ) : order.orderStatus === "Paid" ? (
              <>
                <p className="text-blue-600 bg-[#2e3f4a] px-2 py-1 rounded-lg">
                  <FaCheckDouble className="inline mr-2" />
                  {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-blue-600" /> Payment
                  received
                </p>
              </>
            ) : (
              <>
                <p className="text-yellow-600 bg-[#4a452e] px-2 py-1 rounded-lg">
                  <FaCircle className="inline mr-2" />
                  {order.orderStatus}
                </p>
                <p className="text-[#ababab] text-sm">
                  <FaCircle className="inline mr-2 text-yellow-600" /> Preparing
                  your order
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 text-[#ababab]">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} Items</p>
      </div>

      <hr className="w-full mt-4 border-gray-500 border-t-1" />

      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">
          &#8369;{order.bills.totalWithTax.toFixed(2)}
        </p>
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={(e) =>
            handleStatusChange({ orderId: order._id, orderStatus: "Paid" })
          }
          disabled={order.orderStatus !== "Ready"}
          className={`flex-1 rounded-md ${
            order.orderStatus !== "Ready"
              ? "opacity-40 bg-gray-500"
              : "bg-green-600"
          }`}
        >
          BILL OUT
        </button>
        <button
          disabled={
            order.orderStatus === "Ready" || order.orderStatus === "Paid"
          }
          onClick={handleEditOrder}
          className={`flex-1 rounded-md ${
            order.orderStatus !== "In Progress"
              ? "opacity-40 bg-gray-500"
              : "bg-blue-600"
          }`}
        >
          EDIT ORDER
        </button>
      </div>

      {showInvoice && orderData && (
        <Invoice orderInfo={orderData} setShowInvoice={setShowInvoice} />
      )}
    </div>
  );
};

export default OrderCard;
