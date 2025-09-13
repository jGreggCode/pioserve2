import React, { useState } from "react";
import { useSelector } from "react-redux";
import { formatDate, getAvatarName } from "../../utils";

const CustomerInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const customerData = useSelector((state) => state.customer);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-4">
      <div className="flex flex-col items-start">
        <h1 className="text-sm sm:text-md text-[#f5f5f5] font-semibold tracking-wide">
          {customerData.customerName || "Customer Name"}
        </h1>
        <p className="text-xs text-[#ababab] font-medium mt-1">
          #{customerData.orderId || "N/A"} / Dine in
        </p>
        <p className="text-xs text-[#ababab] font-medium mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="p-2 text-sm font-bold rounded-lg bg-primary sm:p-3 sm:text-xl">
        {getAvatarName(customerData.customerName) || "CN"}
      </button>
    </div>
  );
};

export default CustomerInfo;
