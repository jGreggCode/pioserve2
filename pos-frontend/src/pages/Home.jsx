import React, { useEffect, useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import Greetings from "../components/home/Greetings";
import { BsCashCoin } from "react-icons/bs";
import { GrInProgress } from "react-icons/gr";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";
import { getTotal, getTotalToday } from "../https";
import { enqueueSnackbar } from "notistack";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [yesterdayTotal, setYesterdayTotal] = useState(0);

  useEffect(() => {
    document.title = "POS | Home"
  }, [])

  // Today
  useEffect(() => {
    const fetchTotalToday = async () => {
      try {
        const res = await getTotalToday();
        if (res.data.success) {
          console.log(res)
          setTotalToday(res.data.data.dailyTotal);
          setYesterdayTotal(res.data.data.yesterdayTotal);
        } else {
          enqueueSnackbar("Failed to fetch total orders", { variant: "error" });
        }
      } catch (error) {
        
      }
    }
    fetchTotalToday();
  }, [])

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await getTotal();
        if (res.data.success) {
          setTotal(res.data.data.dailyTotal);
        } else {
          enqueueSnackbar("Failed to fetch total orders", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching totals", { variant: "error" });
      } 
    };
    fetchTotals();
  }, []);

  const calculatePercentageIncrease = (startValue, endValue) => {
    // Ensure the startValue is a valid, non-zero number to avoid division by zero.
    if (typeof startValue !== 'number' || startValue === 0) {
      return 0;
    }
    
    // Ensure the endValue is a valid number.
    if (typeof endValue !== 'number') {
      console.error("The ending value must be a number.");
      return null;
    }

    // Calculate the difference between the two numbers.
    const difference = endValue - startValue;

    // Calculate the percentage increase using the formula: (difference / startValue) * 100.
    const percentageIncrease = (difference / startValue) * 100;

    return parseFloat(percentageIncrease.toFixed(2));
  };

  return (
    <section className="bg-[#1f1f1f]  h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
      {/* Left Div */}
      <div className="flex-[3]">
        <Greetings />
        <div className="flex items-center w-full gap-3 px-8 mt-8">
          <MiniCard title="Total Earnings" icon={<BsCashCoin />} number={total} />
          <MiniCard title="Earnings Today" icon={<GrInProgress />} number={totalToday} footerNum={calculatePercentageIncrease(yesterdayTotal, totalToday)} />
        </div>
        <RecentOrders />
      </div>
      {/* Right Div */}
      <div className="flex-[2]">
        <PopularDishes />
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
