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

    const fetchOrdersByEmployee = async (userId) => {
			try {
        const res = await getOrdersByEmployee(userId);
        if (res.data.success) {
          setCustomerCount(res.data.totalOrders);
        } else {
          enqueueSnackbar("Failed to fetch total orders by employeee", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching total orders by employeee", { variant: "error" });
      } 
		}

		fetchOrdersByEmployee(userData._id);
    fetchTotalToday();
  }, [])

  const calculatePercentageIncrease = (startValue, endValue) => {
    // Ensure the startValue is a valid, non-zero number to avoid division by zero.
    startValue = parseFloat(startValue);
    endValue = parseFloat(endValue)

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
          <div className='bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%]'>
            <div className='flex items-start justify-between'>
                <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>Your total orders</h1>
                <button className={`bg-[#f6b100] p-3 rounded-lg text-[#f5f5f5] text-2xl`}><GoPeople/></button>
            </div>
            <div>
                <h1 className='text-[#f5f5f5] text-4xl font-bold mt-5'>{customerCount}</h1>
                <h1 className='text-[#f5f5f5] text-lg mt-2'>{customerCount > 3 ? "Keep it up 👍" : "Don't forget to smile 😊"}</h1>
            </div>
          </div>
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
