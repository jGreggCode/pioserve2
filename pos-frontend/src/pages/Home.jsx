import { useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { GrInProgress } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { getTotalToday, getOrdersByEmployee } from "../https";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

const Home = () => {
  const userData = useSelector((state) => state.user);
  const [totalToday, setTotalToday] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [orderToday, setOrderToday] = useState(0);

  useEffect(() => {
    document.title = "POS | Home";
  }, []);

  useEffect(() => {
    const fetchTotalToday = async () => {
      try {
        const res = await getTotalToday();
        if (res.data.success) {
          setTotalToday(res.data.data.dailyTotal);
          setYesterdayTotal(res.data.data.yesterdayTotal);
        } else {
          enqueueSnackbar("Failed to fetch total orders", { variant: "error" });
        }
      } catch (error) {}
    };

    const fetchOrdersByEmployee = async (userId) => {
      try {
        const res = await getOrdersByEmployee(userId);
        if (res.data.success) {
          setCustomerCount(res.data.totalOrders);
          setOrderToday(res.data.todayOrders);
        } else {
          enqueueSnackbar("Failed to fetch total orders by employeee", {
            variant: "error",
          });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching total orders by employeee", {
          variant: "error",
        });
      }
    };

    fetchOrdersByEmployee(userData._id);
    fetchTotalToday();
  }, []);

  const calculatePercentageIncrease = (startValue, endValue) => {
    startValue = parseFloat(startValue);
    endValue = parseFloat(endValue);

    if (typeof startValue !== "number" || startValue === 0) return 0;
    if (typeof endValue !== "number") return null;

    const difference = endValue - startValue;
    return parseFloat(((difference / startValue) * 100).toFixed(2));
  };

  return (
    <section className="bg-[#1f1f1f] min-h-screen overflow-y-auto flex flex-col md:flex-row gap-3">
      {/* Left Div */}
      <div className="flex-[3] w-full">
        <Greetings />

        <div className="flex flex-col gap-3 px-4 mt-6 sm:flex-row sm:px-6 md:px-8">
          {/* Card 1 */}
          <div className="bg-[#1a1a1a] py-5 px-5 rounded-lg w-full sm:w-1/2">
            <div className="flex items-start justify-between">
              <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
                Your Total Orders
              </h1>
              <button className="bg-[#f6b100] p-3 rounded-lg text-[#f5f5f5] text-2xl">
                <GoPeople />
              </button>
            </div>
            <div>
              <h1 className="text-[#f5f5f5] text-4xl font-bold mt-5">
                {customerCount}
              </h1>
              <h1 className="text-[#f5f5f5] text-lg mt-2">
                Today: {orderToday}
              </h1>
            </div>
          </div>

          {/* Card 2 */}
          <MiniCard
            title="Earnings Today"
            icon={<GrInProgress />}
            number={totalToday}
            footerNum={calculatePercentageIncrease(
              yesterdayTotal,
              totalToday
            )}
          />
        </div>

        <div className="px-4 mt-6 sm:px-6 md:px-8">
          <RecentOrders />
        </div>
      </div>

      {/* Right Div */}
      <div className="flex-[2] w-full md:w-auto px-4 sm:px-6 md:px-0">
        <PopularDishes />
      </div>

      {/* Mobile BottomNav */}
      <div className="block">
        <BottomNav />
      </div>
    </section>
  );
};

export default Home;
