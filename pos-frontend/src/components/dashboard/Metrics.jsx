import { useEffect, useState } from "react";
import { fetchMetricsData } from "../../https";
import { enqueueSnackbar } from "notistack";
import {
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  Utensils,
  Table as TableIcon,
  User as UserIcon,
} from "lucide-react";

const ranges = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

const Metrics = () => {
  const [range, setRange] = useState("today");
  const [metrics, setMetrics] = useState(null);
  const [customDates, setCustomDates] = useState({ from: "", to: "" });

  const fetchMetrics = async () => {
    try {
      const params =
        range === "custom"
          ? { range, from: customDates.from, to: customDates.to }
          : { range };
      const res = await fetchMetricsData({ params });
      if (res.data.success) {
        setMetrics(res.data.data);
      } else {
        enqueueSnackbar("Failed to fetch metrics", { variant: "error" });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Error fetching metrics", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [range]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!metrics) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="container px-6 py-4 mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Overall Performance</h2>
          <p className="text-sm text-gray-400">
            Track your earnings, orders and customer activity.
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {ranges.map((r) => (
            <button
              key={r.value}
              className={`px-3 py-1 rounded-md transition ${
                range === r.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
          <input
            type="date"
            value={customDates.from}
            onChange={(e) =>
              setCustomDates({ ...customDates, from: e.target.value })
            }
            className="px-2 text-white bg-gray-800 rounded"
          />
          <input
            type="date"
            value={customDates.to}
            onChange={(e) =>
              setCustomDates({ ...customDates, to: e.target.value })
            }
            className="px-2 text-white bg-gray-800 rounded"
          />
          <button
            onClick={() => {
              setRange("custom");
              fetchMetrics();
            }}
            className="px-3 py-1 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4">
        <div className="p-4 rounded-lg shadow bg-gradient-to-br from-blue-500 to-blue-700">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <DollarSign size={16} />
            Total Restaurant Earnings
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            ₱ {metrics.overallTotal.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-lg shadow bg-gradient-to-br from-red-500 to-red-700">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <Clock size={16} />
            Pending Payment
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            ₱ {metrics.unpaidTotal.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-lg shadow bg-gradient-to-br from-green-500 to-green-700">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <CheckCircle size={16} />
            Paid
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            ₱ {metrics.paidTotal.toFixed(2)}
          </p>
        </div>
        <div className="p-4 rounded-lg shadow bg-gradient-to-br from-yellow-500 to-yellow-700">
          <p className="flex items-center gap-2 text-sm font-medium text-white">
            <Users size={16} />
            Total Customers
          </p>
          <p className="mt-2 text-3xl font-bold text-white">
            {metrics.customersCount}
          </p>
        </div>
      </div>

      {/* Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-white">Resource Summary</h2>
        <p className="text-sm text-gray-400">
          Quick overview of dishes, orders, tables and users.
        </p>

        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(metrics.resources).map(([key, value]) => {
            const iconMap = {
              dishes: <Utensils size={18} />,
              orders: <Package size={18} />,
              tables: <TableIcon size={18} />,
              users: <UserIcon size={18} />,
            };
            return (
              <div
                key={key}
                className="p-4 text-white transition bg-gray-800 rounded-lg shadow hover:bg-gray-700"
              >
                <p className="flex items-center gap-2 text-sm font-medium capitalize">
                  {iconMap[key] || <Package size={18} />} {key}
                </p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Metrics;
