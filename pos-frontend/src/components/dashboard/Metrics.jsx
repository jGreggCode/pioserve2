/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useEffect, useState } from "react";
import { itemsData, metricsData } from "../../constants";
import {
  getTotal,
  getOrdersCount,
  getCustomerCount,
  getAllCounts,
} from "../../https";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

const Metrics = () => {
  const [total, setTotal] = useState(0);
  const [pendingPayment, setPendingPayment] = useState(0);
  const [overAll, setOverAll] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [allData, setAllData] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const countedData = await getAllCounts();
        if (countedData.data.success) {
          const counts = countedData.data.data; // { dishes: 42, orders: 108, ... }

          // Transform into array for rendering
          const formatted = [
            {
              title: "Dishes",
              value: counts.dishes,
              color: "#025cca",
              percentage: "10%",
            },
            {
              title: "Orders",
              value: counts.orders,
              color: "#02ca3a",
              percentage: "15%",
            },
            {
              title: "Tables",
              value: counts.tables,
              color: "#f6b100",
              percentage: "8%",
            },
            {
              title: "Users",
              value: counts.users,
              color: "#ca025c",
              percentage: "20%",
            },
          ];

          setAllData(formatted);
        }

        const res = await getTotal();
        if (res.data.success) {
          setTotal(res.data.data.paidTotal);
          setPendingPayment(res.data.data.unpaidTotal);
          setOverAll(res.data.data.overallTotal);
          console.log(res);
        } else {
          enqueueSnackbar("Failed to fetch total orders", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching totals", { variant: "error" });
      }
    };

    const fetchOrdersCount = async () => {
      try {
        const res = await getOrdersCount();
        if (res.data.success) {
          setOrdersCount(res.data.total);
        } else {
          enqueueSnackbar("Failed to fetch total customer", {
            variant: "error",
          });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching total customer", { variant: "error" });
      }
    };

    const fetchCustomerCount = async () => {
      try {
        const res = await getCustomerCount();
        if (res.data.success) {
          setCustomerCount(res.data.total);
        } else {
          enqueueSnackbar("Failed to fetch total orders", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching total orders", { variant: "error" });
      }
    };

    fetchCustomerCount();
    fetchTotals();
    fetchOrdersCount();
  }, []);

  return (
    <div className="container px-6 py-2 mx-auto md:px-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            A summary of earnings, orders, and customer activity to track
            overall business performance.
          </p>
        </div>
        <p className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          All Time
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-4">
        <div className="w-full mt-6">
          <div className="shadow-sm rounded-lg p-4 bg-[#025cca]">
            <div className="flex items-center justify-between">
              <p className="font-medium text-xs text-[#f5f5f5]">
                Total Restaurant Earnings
              </p>
            </div>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
              &#8369; {overAll}
            </p>
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="shadow-sm rounded-lg p-4 bg-[#922b28]">
            <div className="flex items-center justify-between">
              <p className="font-medium text-xs text-[#f5f5f5]">
                Pending Payment
              </p>
            </div>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
              &#8369; {pendingPayment}
            </p>
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="shadow-sm rounded-lg p-4 bg-[#4af876]">
            <div className="flex items-center justify-between">
              <p className="font-medium text-xs text-[#f5f5f5]">Paid</p>
            </div>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
              {total}
            </p>
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="shadow-sm rounded-lg p-4 bg-[#e4ba00]">
            <div className="flex items-center justify-between">
              <p className="font-medium text-xs text-[#f5f5f5]">
                Total Customer
              </p>
            </div>
            <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
              {customerCount}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Resource Summary
          </h2>
          <p className="text-sm text-[#ababab]">
            A quick overview of the core resources managed in the system,
            including dishes, orders, tables, and users.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {allData.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow-sm"
              style={{ backgroundColor: item.color }}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {item.title}
                </p>
                <div className="flex items-center gap-1"></div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
