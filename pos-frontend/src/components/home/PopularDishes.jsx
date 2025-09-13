import { useEffect, useState } from "react";
import { getTopDishes } from "../../https/index";
import { enqueueSnackbar } from "notistack";

const PopularDishes = () => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await getTopDishes();
        if (res.data.success) {
          setPopularDishes(res.data.data);
        } else {
          enqueueSnackbar("Failed to fetch dishes", { variant: "error" });
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Error fetching dishes", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  console.log(popularDishes);

  return (
    <div className="mt-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Popular Dishes
          </h1>
          <a href="#" className="text-[#025cca] text-sm font-semibold">
            View all
          </a>
        </div>

        <div className="overflow-y-scroll h-[500px] sm:h-[680px] scrollbar-hide px-2 sm:px-0">
          {loading ? (
            <div className="flex justify-center items-center h-full text-[#ababab]">
              Loading popular dishes...
            </div>
          ) : popularDishes.length === 0 ? (
            <div className="flex justify-center items-center h-full text-[#ababab]">
              No popular dishes found
            </div>
          ) : (
            popularDishes.map((dish, index) => (
              <div
                key={dish._id || index}
                className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-4 sm:px-6 py-4 mt-4 mx-2 sm:mx-6"
              >
                <h1 className="text-[#f5f5f5] font-bold text-lg sm:text-xl mr-4">
                  {index + 1 < 10 ? `0${index + 1}` : index + 1}
                </h1>
                {/* <img
                  src={dish.image || "/placeholder.png"}
                  alt={dish.name}
                  className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full object-cover"
                /> */}
                <div>
                  <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base">
                    {dish.name}
                  </h1>
                  <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
                    <span className="text-[#ababab]">Orders: </span>
                    {dish.totalOrdered || dish.numberOfOrders || 0}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
