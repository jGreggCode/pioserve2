/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

// React
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Endpoints
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
  getUserDataById,
} from "../../https/index";

// Utils
import { formatDateAndTime } from "../../utils";
import { enqueueSnackbar } from "notistack";

// Invoice Component
import KitchenTicket from "../invoice/KitchenTicket";

const RecentOrders = () => {
  const [selected, setSelected] = useState("Today");
  const [showKitchenTicket, setShowKitchenTicket] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const userData = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  // ✅ Update Order Status
  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully!", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  // ✅ Delete Order
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: () => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete order!", { variant: "error" });
    },
  });

  // ✅ Handle status change
  const handleStatusChange = ({ orderId, orderStatus }) => {
    if (orderStatus === "Delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (confirmDelete) deleteOrderMutation.mutate(orderId);
      return;
    }
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  // ✅ Print Kitchen Ticket
  const handlePrintReceipt = async (order) => {
    try {
      const employeeRes = await getUserDataById(order.employee);
      const employeeData = employeeRes?.data?.data || null;
      setOrderData({ ...order, employeeData });
      setShowKitchenTicket(true);
    } catch (error) {
      enqueueSnackbar("Failed to load employee data", { variant: "error" });
    }
  };

  // ✅ Fetch Orders
  const { data: resData, isError } = useQuery({
    queryKey: ["orders", selected],
    queryFn: async () =>
      selected === "Today" ? await getOrders() : await getAllOrders(),
    placeholderData: keepPreviousData,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  const orders = resData?.data?.data || [];

  return (
    <div className="container mx-auto bg-[#262626] p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="px-2 mb-6">
        <h2 className="text-[#f5f5f5] text-xl font-semibold">Recent Orders</h2>
        <p className="text-sm text-[#ababab]">
          Track your latest customer orders, their status, tables, and payments.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-end px-2 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setSelected("Today")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === "Today"
                ? "bg-slate-400 text-black"
                : "bg-[#1a1a1a] text-[#f5f5f5] hover:bg-[#333]"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelected("All")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === "All"
                ? "bg-slate-400 text-black"
                : "bg-[#1a1a1a] text-[#f5f5f5] hover:bg-[#333]"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {orders
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .map((order) => {
            const hasExistingItems = order.items.some(
              (item) => (item.isExisting ?? true) === true
            );

            return (
              <div
                key={order._id}
                className="bg-[#2d2d2d] rounded-xl shadow-md p-5 hover:bg-[#333] transition-colors flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-sm text-gray-300">
                    #{Math.floor(new Date(order.orderDate).getTime())}
                  </p>

                  <select
                    disabled={
                      order.orderStatus === "Paid" && userData.role === "Chef"
                    }
                    className={`bg-[#1a1a1a] border border-gray-600 px-3 py-1.5 rounded-lg text-xs focus:outline-none ${
                      order.orderStatus === "Ready"
                        ? "text-green-400"
                        : order.orderStatus === "Paid"
                        ? "text-blue-300"
                        : "text-yellow-400"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange({
                        orderId: order._id,
                        orderStatus: e.target.value,
                      })
                    }
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Ready">Ready</option>
                    {userData.role === "Admin" && (
                      <option value="Delete">Delete</option>
                    )}
                    <option disabled hidden value="Paid">
                      Paid
                    </option>
                  </select>
                </div>

                {/* Order Details */}
                <div className="space-y-2 text-sm text-[#f5f5f5]">
                  <p>
                    <span className="font-semibold">Customer:</span>{" "}
                    {order.customerDetails.name}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {formatDateAndTime(order.orderDate)}
                  </p>
                  <p>
                    <span className="font-semibold">Table:</span>{" "}
                    {order.table ? `Table ${order.table.tableNo}` : "Take Out"}
                  </p>
                  <p>
                    <span className="font-semibold">Server:</span>{" "}
                    {order.employee.name}
                  </p>
                  {console.log(order)}

                  {/* Items */}
                  <div>
                    <span className="font-semibold">Items:</span>
                    <ul className="ml-5 text-gray-300 list-disc">
                      {order.items.map((item) => {
                        const isExisting = item.isExisting ?? true;
                        const showNewTag =
                          order.orderStatus === "In Progress" &&
                          hasExistingItems &&
                          !isExisting;

                        return (
                          <li key={item.id} className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span>
                                {item.name} x{item.quantity}
                              </span>
                              {showNewTag && (
                                <span className="text-red-500 text-[11px] font-semibold uppercase">
                                  NEW
                                </span>
                              )}
                            </div>
                            {item.note && (
                              <span className="pl-2 text-xs text-gray-400">
                                Note: {item.note}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-lg font-bold text-[#f5f5f5]">
                    ₱{order.bills.totalWithTax}
                  </p>
                  <button
                    disabled={order.orderStatus === "Paid"}
                    onClick={() => handlePrintReceipt(order)}
                    className={`px-4 py-1.5 text-xs rounded-lg text-white ${
                      order.orderStatus !== "Paid"
                        ? "bg-primary hover:bg-accent"
                        : "bg-slate-400 cursor-not-allowed"
                    }`}
                  >
                    Kitchen Ticket
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Kitchen Ticket Modal */}
      {showKitchenTicket && orderData && (
        <KitchenTicket
          orderInfo={orderData}
          setShowInvoice={setShowKitchenTicket}
        />
      )}
    </div>
  );
};

export default RecentOrders;
