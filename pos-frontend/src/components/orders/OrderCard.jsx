/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  updateOrderStatus,
  updateOrderDiscount,
  getUserDataById,
  updateTable,
} from "../../https/index";
import { useState } from "react";
import { FaCheckDouble, FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import Invoice from "../invoice/Invoice";
import KitchenTicket from "../invoice/KitchenTicket";
import DiscountModal from "../shared/DiscountModal";
import { useDispatch, useSelector } from "react-redux";
import { clearDiscount } from "../../redux/slices/discountSlice";
import { setCustomerFromOrder } from "../../redux/slices/customerSlice";
import { removeAllItems, addItems } from "../../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const userData = useSelector((state) => state.user);
  const discounts = useSelector((state) => state.discount);
  const [orderData, setOrderData] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showKitchenTicket, setShowKitchenTicket] = useState(false);

  const total = Number(order.bills.total || 0); // subtotal pre-tax
  const guests = Number(order.customerDetails?.guests || 1);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(guests);

  const openDiscountModal = () => setIsDiscountModalOpen(true);
  const closeDiscountModal = () => setIsDiscountModalOpen(false);

  // === DISCOUNT COMPUTATION (frontend mirror of backend algorithm) ===
  // Use only valid discounts (type, cardId, numeric discountValue)
  const validDiscounts = (discounts || []).filter(
    (d) =>
      d &&
      (d.type === "Senior" || d.type === "PWD") &&
      d.cardId &&
      d.discountValue !== undefined &&
      d.discountValue !== null &&
      !isNaN(Number(d.discountValue))
  );

  const discountCount = validDiscounts.length;
  const maxDiscountPercent =
    discountCount > 0
      ? Math.max(...validDiscounts.map((d) => Number(d.discountValue)))
      : 0;

  const perHead = guests > 0 ? total / guests : total;
  const discountAmount = Number(
    (perHead * (maxDiscountPercent / 100) * discountCount).toFixed(2)
  );

  const discountedSubtotal = Number((total - discountAmount).toFixed(2));

  // Recompute tax proportionally using existing stored tax (if available)
  const originalTax = Number(order.bills?.tax || 0);
  const originalTotal = Number(order.bills?.total || 0);
  const taxRateFraction = originalTotal > 0 ? originalTax / originalTotal : 0; // e.g. 0.0525
  const recomputedTax = Number(
    (discountedSubtotal * taxRateFraction).toFixed(2)
  );
  const totalPriceWithTax = Number(
    (discountedSubtotal + recomputedTax).toFixed(2)
  );

  // --- mutations ---
  const orderDiscountUpdateMutation = useMutation({
    mutationFn: ({ orderId, discounts }) =>
      updateOrderDiscount({ orderId, discounts }), // backend will compute bills
    onSuccess: (res) => {
      enqueueSnackbar("Discount added successfully", { variant: "success" });
      // refresh orders so UI shows updated data
      queryClient.invalidateQueries(["orders"]);
      // clear client discount slice (optional)
      dispatch(clearDiscount());
      closeDiscountModal();
    },
    onError: () => {
      enqueueSnackbar("Failed to add discount!", { variant: "error" });
    },
  });

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),
    onSuccess: (res, variables) => {
      enqueueSnackbar("Order status updated successfully!", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]);

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
    onSuccess: () => dispatch(removeAllItems()),
    onError: (error) => console.error("Table update failed:", error),
  });

  // Called by DiscountModal with the exact rows user confirmed
  const handleDiscount = async (discountRows) => {
    try {
      // ensure we pass the exact discounts the user confirmed
      orderDiscountUpdateMutation.mutate({
        orderId: order._id,
        discounts: discountRows,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async ({ orderId, orderStatus }) => {
    try {
      const employeeRes = await getUserDataById(order.employee);
      const employeeData = employeeRes?.data?.data || null;
      setOrderData({ ...order, employeeData });
      setShowInvoice(true);
      //orderStatusUpdateMutation.mutate({ orderId, orderStatus });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddDiscount = async () => {
    setGuestCount(order.customerDetails.guests || 1);
    openDiscountModal();
  };

  const handleEditOrder = () => {
    dispatch(
      setCustomerFromOrder({
        orderId: order._id,
        customerDetails: order.customerDetails,
        table: order.table,
      })
    );
    dispatch(removeAllItems());
    order.items.forEach((item) => dispatch(addItems(item)));
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
          onClick={async () => {
            try {
              const employeeRes = await getUserDataById(order.employee);
              const employeeData = employeeRes?.data?.data || null;
              setOrderData({ ...order, employeeData });
              setShowKitchenTicket(true);
            } catch (error) {
              console.error(error);
            }
          }}
          disabled={order.orderStatus !== "In Progress"}
          className={`flex-1 rounded-md ${
            order.orderStatus !== "In Progress"
              ? "opacity-40 bg-gray-500"
              : "bg-primary"
          }`}
        >
          Print Order Items
        </button>

        {userData.role !== "Waiter" && (
          <button
            onClick={() =>
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
        )}

        <button
          onClick={handleAddDiscount}
          disabled={order.orderStatus !== "Ready"}
          className={`relative flex-1 rounded-md ${
            order.orderStatus !== "Ready"
              ? "opacity-40 bg-gray-500"
              : "bg-blue-600"
          }`}
        >
          {validDiscounts.length > 0 && (
            <span className="absolute text-sm rounded-full top-[-7px] right-[-5px] w-4 h-4 flex justify-center items-center bg-red-200">
              {validDiscounts.length}
            </span>
          )}
          Add Discount
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

      {showKitchenTicket && orderData && (
        <KitchenTicket
          orderInfo={orderData}
          setShowInvoice={setShowKitchenTicket}
        />
      )}

      {showInvoice && orderData && (
        <Invoice
          orderInfo={orderData}
          setShowInvoice={setShowInvoice}
          handlePrintMutation={orderStatusUpdateMutation}
        />
      )}

      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={closeDiscountModal}
        maxDiscounts={guestCount}
        handleDiscount={handleDiscount} // will receive discountRows from modal
      />
    </div>
  );
};

export default OrderCard;
