import React from "react";
import { popularDishes } from "../../constants";

const PopularDishes = () => {
  return (
    <div className="mt-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Popular Dishes
          </h1>
          <a href="" className="text-[#025cca] text-sm font-semibold">
            View all
          </a>
        </div>

        <div className="overflow-y-scroll h-[500px] sm:h-[680px] scrollbar-hide px-2 sm:px-0">
          {popularDishes.map((dish) => (
            <div
              key={dish.id}
              className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-4 sm:px-6 py-4 mt-4 mx-2 sm:mx-6"
            >
              <h1 className="text-[#f5f5f5] font-bold text-lg sm:text-xl mr-4">
                {dish.id < 10 ? `0${dish.id}` : dish.id}
              </h1>
              <img
                src={dish.image}
                alt={dish.name}
                className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full"
              />
              <div>
                <h1 className="text-[#f5f5f5] font-semibold tracking-wide text-sm sm:text-base">
                  {dish.name}
                </h1>
                <p className="text-[#f5f5f5] text-xs sm:text-sm font-semibold mt-1">
                  <span className="text-[#ababab]">Orders: </span>
                  {dish.numberOfOrders}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
