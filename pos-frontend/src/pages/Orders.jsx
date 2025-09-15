/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import {
  FaList,
  FaHourglassHalf,
  FaCheckCircle,
  FaInbox,
} from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { enqueueSnackbar } from "notistack";

const Orders = () => {
  const [status, setStatus] = useState("all");

  useEffect(() => {
    document.title = "POS | Orders";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
    refetchInterval: 1000,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <section className="bg-[#1f1f1f] min-h-screen lg:h-[calc(100vh-5rem)] flex flex-col overflow-y-auto lg:overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 px-6 py-6 md:flex-row md:items-center md:px-10">
        {/* Title + Back */}
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl md:text-3xl font-bold tracking-wide">
            Orders
          </h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-3">
          {[
            { key: "all", label: "All", icon: <FaList /> },
            {
              key: "progress",
              label: "In Progress",
              icon: <FaHourglassHalf />,
            },
            { key: "ready", label: "Ready", icon: <FaCheckCircle /> },
            { key: "paid", label: "Paid", icon: <FaMoneyBillTrendUp /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
                status === key
                  ? "bg-[#383838] text-primary shadow-md scale-105"
                  : "text-[#ababab] hover:bg-[#2a2a2a] hover:text-primary"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid flex-1 gap-6 px-6 py-6 mb-24 overflow-y-auto scrollbar-hide md:px-10 lg:grid-cols-2 xl:grid-cols-3">
        {resData?.data.data.length > 0 ? (
          resData.data.data
            .filter((order) => {
              if (status === "all") return true;
              if (status === "progress")
                return order.orderStatus === "In Progress";
              if (status === "ready") return order.orderStatus === "Ready";
              if (status === "paid") return order.orderStatus === "Paid";
              return false;
            })
            .map((order) => <OrderCard key={order._id} order={order} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center col-span-full">
            <FaInbox className="text-6xl mb-4 text-[#ababab]" />
            <p className="text-lg font-semibold text-white">
              No orders available
            </p>
            <p className="text-sm text-[#ababab]">
              Orders will appear here once created
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
