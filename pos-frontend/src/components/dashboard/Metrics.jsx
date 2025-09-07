import {useEffect, useState} from "react";
import { itemsData, metricsData } from "../../constants";
import { getTotal, getOrdersCount, getCustomerCount} from "../../https";
import { enqueueSnackbar } from "notistack";
import { useSelector } from "react-redux";

const Metrics = () => {
  const [total, setTotal] = useState(0);
	const [ordersCount, setOrdersCount] = useState(0);
	const [customerCount, setCustomerCount] = useState(0);
 
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

		const fetchOrdersCount = async () => {
			try {
        const res = await getOrdersCount();
        if (res.data.success) {
          setOrdersCount(res.data.total);
        } else {
          enqueueSnackbar("Failed to fetch total customer", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching total customer", { variant: "error" });
      } 
		}

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
		}

		fetchCustomerCount();
    fetchTotals();
		fetchOrdersCount();
  }, []);


  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-[#ababab]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Distinctio, obcaecati?
          </p>
        </div>
        <p className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a]">
          All Time
          {/* <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg> */}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
				<div className="mt-6 w-full">
					<div className="shadow-sm rounded-lg p-4 bg-[#025cca]">
						<div className="flex justify-between items-center">
							<p className="font-medium text-xs text-[#f5f5f5]">
								Total Restaurant Earnings
							</p>
						</div>
						<p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
							&#8369; {total}
						</p>
					</div>
      	</div>
				<div className="mt-6 w-full">
					<div className="shadow-sm rounded-lg p-4 bg-[#02ca3a]">
						<div className="flex justify-between items-center">
							<p className="font-medium text-xs text-[#f5f5f5]">
								Total Orders
							</p>
						</div>
						<p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
							{ordersCount}
						</p>
					</div>
      	</div>
				<div className="mt-6 w-full">
					<div className="shadow-sm rounded-lg p-4 bg-[#f6b100]">
						<div className="flex justify-between items-center">
							<p className="font-medium text-xs text-[#f5f5f5]">
								Total Customers
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
            Item Details
          </h2>
          <p className="text-sm text-[#ababab]">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Distinctio, obcaecati?
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

            {
                itemsData.map((item, index) => {
                    return (
                        <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                              <path d="M5 15l7-7 7 7" />
                            </svg>
                            <p className="font-medium text-xs text-[#f5f5f5]">{item.percentage}</p>
                          </div>
                        </div>
                        <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
                      </div>
                    )
                })
            }

        </div>
      </div>
    </div>
  );
};

export default Metrics;
