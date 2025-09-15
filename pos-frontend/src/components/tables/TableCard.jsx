/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { freeTable } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";

// Icons
import { FaChair, FaUser } from "react-icons/fa";
import { MdEventSeat } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";

const TableCard = ({ id, name, status, initials, seats, isChecked }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customerData = useSelector((state) => state.customer);
  const queryClient = useQueryClient();

  const handleFree = async (tableId) => {
    try {
      console.log("Freeing table with ID:", tableId);
      await freeTable(tableId);
      enqueueSnackbar(`Free table success`, { variant: "success" });

      // ✅ Invalidate the 'tables' query so it reloads
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    } catch (err) {
      console.error("Failed to free table:", err);
    }
  };

  const handleClick = (name) => {
    if (status === "Booked") return;

    if (!isChecked) {
      if (customerData.guests > seats)
        return enqueueSnackbar(`Out of space`, { variant: "warning" });
    }

    if (customerData.orderId === "") return;

    const table = { tableId: id, tableNo: name };
    dispatch(updateTable({ table }));
    navigate(`/menu`);
  };

  // ✅ Run effect every time `status` changes
  useEffect(() => {
    console.log(`Table ${name} status changed to: ${status}`);
    // 👉 You could also trigger a refetch here if you want:
    // queryClient.invalidateQueries({ queryKey: ["tables"] });
  }, [status, name]);

  return (
    <div
      onClick={() => handleClick(name)}
      key={id}
      className="hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-xl cursor-pointer shadow-md transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between"
    >
      {/* Header: Table Name + Status */}
      <div className="flex items-center justify-between">
        <h1 className="text-[#f5f5f5] text-lg md:text-xl font-semibold flex items-center gap-2">
          Table <FaLongArrowAltRight className="text-[#ababab]" /> {name}
        </h1>
        <span
          className={`text-xs md:text-sm px-3 py-1 rounded-full font-medium ${
            status === "Booked"
              ? "text-green-400 bg-[#2e4a40]"
              : "text-yellow-300 bg-[#4a3b1f]"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Avatar / Customer Initials */}
      <div className="flex items-center justify-center my-6">
        <div
          className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full text-lg md:text-xl font-bold text-white shadow-md`}
          style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}
        >
          {getAvatarName(initials) || (
            <FaUser className="text-[#ababab] text-2xl" />
          )}
        </div>
      </div>

      {/* Footer: Seats + Action */}
      <div className="flex items-center justify-between text-xs md:text-sm">
        <p className="flex items-center gap-1 text-[#ababab]">
          <MdEventSeat className="text-[#f56f21]" />
          Seats: <span className="text-[#f5f5f5] font-medium">{seats}</span>
        </p>

        {status === "Booked" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFree(id);
            }}
            className="flex items-center gap-1 text-red-500 transition-colors hover:text-red-400"
          >
            <IoMdCloseCircle className="text-lg" />
            Free Table
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard;
