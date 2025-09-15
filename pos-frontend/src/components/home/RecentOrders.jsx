/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";
import OrderList from "./OrderList";

const RecentOrders = () => {
  const [filter, setFilter] = useState("All");

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // Apply filter
  const orders = resData?.data?.data || [];
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  return (
    <div className="mt-6">
      <div className="bg-[#1a1a1a] w-full h-[400px] sm:h-[450px] rounded-lg">
        {/* Header + Filter */}
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Recent Orders
          </h1>

          {/* Filter buttons */}
          <div className="flex gap-2">
            {["All", "In Progress", "Ready", "Paid"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? "bg-[#f6b100] text-black"
                    : "bg-[#2e2e2e] text-gray-300 hover:bg-[#3a3a3a]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="mt-2 sm:mt-4 px-4 sm:px-6 overflow-y-scroll h-[250px] sm:h-[300px] scrollbar-hide">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderList key={order._id} order={order} />
            ))
          ) : (
            <p className="text-gray-500">No orders available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
