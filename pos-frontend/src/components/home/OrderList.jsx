/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const OrderList = ({ order }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#1e1e1e] rounded-2xl shadow-lg mb-4">
      {/* Avatar / Initials */}
      <button className="bg-[#f6b100] text-white w-12 h-12 flex items-center justify-center text-lg font-bold rounded-full shadow-md">
        {getAvatarName(order.customerDetails.name)}
      </button>

      {/* Customer & Items */}
      <div className="flex flex-col flex-grow">
        <h1 className="text-lg font-semibold tracking-wide text-white">
          {order.customerDetails.name}
        </h1>
        <p className="text-[#ababab] text-sm">
          {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
        </p>
      </div>

      {/* Table Info */}
      <div className="flex items-center gap-2 px-3 py-1 border border-[#f6b100] text-[#f6b100] font-medium rounded-lg">
        <span>Table</span>
        <FaLongArrowAltRight className="text-[#ababab]" />
        <span>{order.table?.tableNo ? order.table.tableNo : "Take Out"}</span>
      </div>

      {/* Status */}
      <div>
        {order.orderStatus === "Ready" && (
          <p className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-500 rounded-lg bg-green-900/30">
            <FaCheckDouble /> {order.orderStatus}
          </p>
        )}

        {order.orderStatus === "Paid" && (
          <p className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-400 rounded-lg bg-blue-900/30">
            <FaCheckDouble /> {order.orderStatus}
          </p>
        )}

        {order.orderStatus !== "Ready" && order.orderStatus !== "Paid" && (
          <p className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-yellow-400 rounded-lg bg-yellow-900/30">
            <FaCircle /> {order.orderStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderList;
