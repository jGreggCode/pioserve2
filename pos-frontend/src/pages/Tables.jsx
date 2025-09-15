/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

/*
 * Copyright (c) 2025 John Gregg Felicisimo / JGDEV
 *
 * This software is licensed for use only by authorized clients of JGDEV.
 * Redistribution, modification, or resale of this code without written permission
 * is strictly prohibited.
 *
 * For full rights to the source code, including resale or modification rights,
 * a separate license agreement and additional payment are required.
 */

import { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateTable } from "../redux/slices/customerSlice";

// Icons
import { FaTh, FaChair, FaRegCheckCircle, FaShoppingBag } from "react-icons/fa";

const Tables = () => {
  const [status, setStatus] = useState("all");
  const [isChecked, setIsChecked] = useState(false);
  const customerData = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Event handler to toggle the state
  const handleOnChange = () => {
    setIsChecked(!isChecked);
  };

  const handleTakeOut = () => {
    if (customerData.orderId === "") return;

    const table = { tableId: null, tableNo: 0 };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  useEffect(() => {
    document.title = "POS | Tables";
  }, []);

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    refetchInterval: 500,
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row">
        {/* Left: Title + Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">
            Tables
          </h1>

          {/* Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleOnChange}
                className="sr-only peer"
              />
              <div
                className="w-12 h-6 bg-gray-400 rounded-full peer-focus:ring-2 peer-focus:ring-accent
              peer dark:bg-gray-600 peer-checked:bg-primary
              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
              after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all
              peer-checked:after:translate-x-6 shadow-md"
              ></div>
            </label>
            <span className="text-sm font-medium text-white whitespace-nowrap">
              Ignore Seat Requirement
            </span>
          </div>

          {/* Take Out Button */}
          <button
            onClick={handleTakeOut}
            className="flex items-center gap-2 px-4 py-1.5 font-semibold text-white bg-[#f56f21] rounded-lg shadow-md transition-all duration-300 hover:bg-primary hover:scale-105 active:scale-95"
          >
            <FaShoppingBag className="text-lg text-white" />
            Take Out
          </button>
        </div>

        {/* Right: Status Filter Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { key: "all", label: "All", icon: <FaTh /> },
            { key: "booked", label: "Booked", icon: <FaChair /> },
            {
              key: "available",
              label: "Available",
              icon: <FaRegCheckCircle />,
            },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setStatus(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-300
            ${
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

      {/* Tables grid */}
      <div className="flex-1 px-6 py-6 mb-24 overflow-y-auto scrollbar-hide md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {resData?.data.data
            ?.filter((table) => {
              if (status === "all") return true;
              return table.status.toLowerCase() === status;
            })
            .map((table) => (
              <TableCard
                key={table._id}
                id={table._id}
                name={table.tableNo}
                status={table.status}
                initials={table?.currentOrder?.customerDetails?.name || ""}
                seats={table.seats}
                isChecked={isChecked}
              />
            ))}
        </div>
      </div>

      {/* Bottom navigation for mobile */}
      <BottomNav />
    </section>
  );
};

export default Tables;
