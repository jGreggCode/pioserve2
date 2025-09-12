import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");

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
      <div className="flex flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row md:px-10">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-xl md:text-2xl font-bold tracking-wider">
            Tables
          </h1>
        </div>
        {/* Status filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {["all", "booked", "available"].map((type) => (
            <button
              key={type}
              onClick={() => setStatus(type)}
              className={`text-[#ababab] text-sm md:text-lg ${
                status === type && "bg-[#383838]"
              } rounded-lg px-3 md:px-5 py-2 font-semibold`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tables grid */}
      <div className="flex-1 px-4 py-4 mb-24 overflow-y-auto scrollbar-hide md:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-5">
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
