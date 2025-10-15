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

  // ✅ Update status mutation
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

  // ✅ Delete mutation
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

  // ✅ Handle change in dropdown
  const handleStatusChange = ({ orderId, orderStatus }) => {
    if (orderStatus === "Delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (confirmDelete) {
        console.log({ orderId });
        deleteOrderMutation.mutate(orderId);
      }
      return;
    }
    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  // ✅ Receipt
  const handlePrintReceipt = async (order) => {
    try {
      const employeeRes = await getUserDataById(order.employee);
      const employeeData = employeeRes?.data?.data || null;
      setOrderData({ ...order, employeeData });
      setShowKitchenTicket(true);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  // ✅ Fetch orders
  const { data: resData, isError } = useQuery({
    queryKey: ["orders", selected],
    queryFn: async () => {
      if (selected === "Today") return await getOrders();
      return await getAllOrders();
    },
    placeholderData: keepPreviousData,
    refetchInterval: 2000,
    refetchOnWindowFocus: true,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <div className="container mx-auto bg-[#262626] p-6 rounded-xl shadow-lg">
      {/* Section Header */}
      <div className="px-2 mb-6">
        <h2 className="font-semibold text-[#f5f5f5] text-xl">Recent Orders</h2>
        <p className="text-sm text-[#ababab]">
          Track your latest customer orders with status, table assignments, and
          payments.
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

      {/* Orders as Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {resData?.data.data
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .map((order, index) => (
            <div
              key={index}
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
                    <>
                      <option value="Delete">Delete</option>
                      <option disabled hidden value="Paid">
                        Paid
                      </option>
                    </>
                  )}
                </select>
              </div>

              {/* Content */}
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
                  <span className="font-semibold">Payment:</span>{" "}
                  {order.paymentMethod}
                </p>
                <p className="font-bold text-red-500">
                  <span className="font-semibold">Note:</span>{" "}
                  {order.note || "None"}
                </p>

                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="ml-5 text-gray-300 list-disc">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name}{" "}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-lg font-bold text-[#f5f5f5]">
                  ₱{order.bills.totalWithTax}
                </p>
                <button
                  onClick={() => handlePrintReceipt(order)}
                  className="px-4 py-1.5 text-xs rounded-lg bg-primary hover:bg-accent text-white"
                >
                  Kitchen Ticket
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Kitchen Ticket */}
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
