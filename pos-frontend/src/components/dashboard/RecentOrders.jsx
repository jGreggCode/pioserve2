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
import Invoice from "../invoice/Invoice";

const RecentOrders = () => {
  const [selected, setSelected] = useState("Today");
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const userData = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({ orderId, orderStatus }) =>
      updateOrderStatus({ orderId, orderStatus }),
    onSuccess: (data) => {
      console.log;
      enqueueSnackbar("Order status updated successfully!", {
        variant: "success",
      });
      queryClient.invalidateQueries(["orders"]); // Refresh order list
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    },
  });

  const handlePrintReceipt = async (order) => {
    try {
      const employeeRes = await getUserDataById(order.employee);
      const employeeData = employeeRes?.data?.data || null;
      setOrderData({ ...order, employeeData });
      setShowInvoice(true);
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
  };

  // ✅ Mutation for deleting order
  const deleteOrderMutation = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: (data) => {
      enqueueSnackbar("Order deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete order!", { variant: "error" });
    },
  });

  // ✅ Handle change in dropdown (status / delete)
  const handleStatusChange = ({ orderId, orderStatus }) => {
    console.log(orderId);
    if (orderStatus === "Delete") {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this order?"
      );
      if (confirmDelete) {
        deleteOrderMutation.mutate({ orderId }); // ✅ Fix here
      }
      return;
    }

    orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  };

  // ✅ Fetch orders
  const { data: resData, isError } = useQuery({
    queryKey: ["orders", selected], // ✅ depend on selected
    queryFn: async () => {
      if (selected === "Today") {
        return await getOrders(); // today's orders
      }
      return await getAllOrders(); // all orders
    },
    placeholderData: keepPreviousData,
    refetchInterval: 500, // 🔄 auto-refresh every 3s
    refetchOnWindowFocus: true, // refresh when user comes back
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // console.log(resData?.data?.data);

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

      {/* Table */}
      <div className="overflow-x-auto border border-gray-700 rounded-lg">
        <table className="w-full text-left text-sm text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab] text-sm uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Table No</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 text-center">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {resData?.data.data
              .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
              .map((order, index) => (
                <tr
                  key={index}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-[#2d2d2d]" : "bg-[#262626]"
                  } hover:bg-[#3a3a3a]`}
                >
                  <td className="px-4 py-4 font-mono text-gray-300">
                    #{Math.floor(new Date(order.orderDate).getTime())}
                  </td>
                  <td className="px-4 py-4">{order.customerDetails.name}</td>
                  <td className="px-4 py-4">
                    <select
                      className={`bg-[#1a1a1a] border border-gray-600 px-3 py-1.5 rounded-lg focus:outline-none text-sm ${
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
                      <option className="text-yellow-400" value="In Progress">
                        In Progress
                      </option>
                      <option className="text-green-400" value="Ready">
                        Ready
                      </option>
                      {userData.role === "Admin" && (
                        <>
                          <option className="text-red-400" value="Delete">
                            Delete
                          </option>
                          <option className="text-blue-400" value="Paid">
                            Paid
                          </option>
                        </>
                      )}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {formatDateAndTime(order.orderDate)}
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        {item.name}{" "}
                        <span className="text-gray-400">x{item.quantity}</span>
                      </div>
                    ))}
                    <button
                      className="font-bold shadow-sm text-primary hover:text-accent"
                      onClick={() => {
                        handlePrintReceipt(order);
                      }}
                    >
                      Show Receipt
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    {order.table ? `Table ${order.table.tableNo}` : "Take Out"}
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#f5f5f5]">
                    ₱{order.bills.totalWithTax}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {order.paymentMethod}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Invoice */}
      {showInvoice && orderData && (
        <Invoice orderInfo={orderData} setShowInvoice={setShowInvoice} />
      )}
    </div>
  );
};

export default RecentOrders;
