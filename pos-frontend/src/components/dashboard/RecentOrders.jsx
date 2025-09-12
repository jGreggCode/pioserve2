import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getAllOrders,
} from "../../https/index";
import { formatDateAndTime } from "../../utils";
import { useSelector } from "react-redux";
import { useState } from "react";

const RecentOrders = () => {
  const [selected, setSelected] = useState("All");
  const userData = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  // const handleStatusChange = ({ orderId, orderStatus }) => {
  //   console.log(orderId);
  //   orderStatusUpdateMutation.mutate({ orderId, orderStatus });
  // };

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

  console.log(resData?.data?.data);

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <div className="flex justify-between px-2 mb-4">
        <h2 className="text-[#f5f5f5] text-xl font-semibold">Recent Orders</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSelected("Today")}
            className={`px-8 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
              selected === "Today" ? "bg-slate-400" : "bg-[#1a1a1a]"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelected("All")}
            className={`px-8 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
              selected === "All" ? "bg-slate-400" : "bg-[#1a1a1a]"
            }`}
          >
            All
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Items</th>
              <th className="p-3">Table No</th>
              <th className="p-3">Total</th>
              <th className="p-3 text-center">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {resData?.data.data
              .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
              .map((order, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-600 hover:bg-[#333]"
                >
                  <td className="p-4">
                    #{Math.floor(new Date(order.orderDate).getTime())}
                  </td>
                  <td className="p-4">{order.customerDetails.name}</td>
                  <td className="p-4">
                    <select
                      className={`bg-[#1a1a1a] text-[#f5f5f5] border border-gray-500 p-2 rounded-lg focus:outline-none ${
                        order.orderStatus === "Ready"
                          ? "text-green-500"
                          : order.orderStatus === "Paid"
                          ? "text-blue-300"
                          : "text-yellow-500"
                      }`}
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange({
                          orderId: order._id,
                          orderStatus: e.target.value,
                        })
                      }
                    >
                      <option className="text-yellow-500" value="In Progress">
                        In Progress
                      </option>
                      <option className="text-green-500" value="Ready">
                        Ready
                      </option>
                      {userData.role === "Admin" && (
                        <>
                          <option className="text-red-500" value="Delete">
                            Delete
                          </option>
                          <option className="text-blue-500" value="Paid">
                            Paid
                          </option>
                        </>
                      )}
                    </select>
                  </td>
                  <td className="p-4">{formatDateAndTime(order.orderDate)}</td>
                  <td className="p-4">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        {item.name} {item.quantity}x
                      </div>
                    ))}
                  </td>
                  <td className="p-4">Table - {order.table.tableNo}</td>
                  <td className="p-4">&#8369;{order.bills.totalWithTax}</td>
                  <td className="p-4">{order.paymentMethod}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
