import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName, getBgColor } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { updateTable } from "../../redux/slices/customerSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import { freeTable } from "../../https";
import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";

const TableCard = ({ id, name, status, initials, seats }) => {
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
      className="w-[300px] hover:bg-[#2c2c2c] bg-[#262626] p-4 rounded-lg cursor-pointer"
    >
      <div className="flex items-center justify-between px-1">
        <h1 className="text-[#f5f5f5] text-xl font-semibold">
          Table <FaLongArrowAltRight className="text-[#ababab] ml-2 inline" />{" "}
          {name}
        </h1>
        <p
          className={`${
            status === "Booked"
              ? "text-green-600 bg-[#2e4a40]"
              : "bg-[#664a04] text-white"
          } px-2 py-1 rounded-lg`}
        >
          {status}
        </p>
      </div>
      <div className="flex items-center justify-center mt-5 mb-8">
        <h1
          className={`text-white rounded-full p-5 text-xl bg-orange-400`}
          style={{ backgroundColor: initials ? getBgColor() : "#1f1f1f" }}
        >
          {getAvatarName(initials) || "N/A"}
        </h1>
      </div>
      <div className="flex flex-row justify-between gap-2">
        <p className="text-[#ababab] text-xs">
          Seats: <span className="text-[#f5f5f5]">{seats}</span>
        </p>
        {status === "Booked" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleFree(id);
            }}
            className="text-xs text-red-500"
          >
            Free Table
          </button>
        )}
      </div>
    </div>
  );
};

export default TableCard;
