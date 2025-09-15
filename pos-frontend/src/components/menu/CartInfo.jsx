/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useEffect, useRef } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";

const CartInfo = () => {
  const cartData = useSelector((state) => state.cart);
  const scrolLRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (scrolLRef.current) {
      scrolLRef.current.scrollTo({
        top: scrolLRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [cartData]);

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  };

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <h1 className="text-lg sm:text-xl text-[#f5f5f5] font-bold tracking-wide flex justify-between items-center gap-2 mb-3">
        Order Details
        <button className="flex gap-2 justify-center items-center p-2 rounded-lg bg-[#292929] hover:bg-blue-500 text-white transition">
          <FaNotesMedical size={18} />
          <span className="text-xs">Add Note</span>
        </button>
      </h1>

      {/* Cart Container */}
      <div
        className="mt-2 overflow-y-auto scrollbar-hide max-h-[300px] sm:max-h-[380px] space-y-3"
        ref={scrolLRef}
      >
        {cartData.length === 0 ? (
          <p className="text-[#ababab] text-sm sm:text-base flex justify-center items-center h-[300px] sm:h-[380px] text-center">
            Your cart is empty. Start adding items!
          </p>
        ) : (
          cartData.map((item, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
            >
              {/* Item Name & Quantity */}
              <div className="flex items-center justify-between">
                <h1 className="text-[#f5f5f5] font-semibold text-base truncate">
                  {item.name}
                </h1>
                <span className="text-[#e4e4e4] font-medium text-sm bg-[#2a2a2a] px-2 py-0.5 rounded-lg">
                  x{item.quantity}
                </span>
              </div>

              {/* Actions & Price */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 rounded-lg bg-[#292929] hover:bg-red-500 text-white transition"
                  >
                    <RiDeleteBin2Fill size={18} />
                  </button>
                </div>
                <p className="text-[#f5f5f5] text-md sm:text-lg font-bold">
                  &#8369;{item.price}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartInfo;
