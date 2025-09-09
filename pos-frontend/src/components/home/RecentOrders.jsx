import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";
import OrderList from "./OrderList";

const RecentOrders = () => {
  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <div className="mt-6">
      <div className="bg-[#1a1a1a] w-full h-[400px] sm:h-[450px] rounded-lg">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Recent Orders
          </h1>
          <a href="" className="text-[#025cca] text-sm font-semibold">
            Orders Today
          </a>
        </div>

        <div className="mt-2 sm:mt-4 px-4 sm:px-6 overflow-y-scroll h-[250px] sm:h-[300px] scrollbar-hide">
          {resData?.data.data.length > 0 ? (
            resData.data.data.map((order) => (
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
