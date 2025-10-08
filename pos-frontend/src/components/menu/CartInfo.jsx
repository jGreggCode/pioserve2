/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaNotesMedical } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../redux/slices/cartSlice";
import { setNote } from "../../redux/slices/noteSlice";

const CartInfo = () => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [note, setNoteLocal] = useState("");
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

  const onsave = (note) => {
    dispatch(setNote(note)); // Redux action
    setShowAddNote(false);
  };

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <h1 className="text-base sm:text-lg md:text-xl text-[#f5f5f5] font-bold tracking-wide flex justify-between items-center gap-2 mb-3">
        Order Details
        <button
          onClick={() => setShowAddNote(true)}
          className="flex items-center gap-2 p-2 sm:p-3 md:p-4 rounded-lg bg-[#292929] hover:bg-accent text-white text-xs sm:text-sm md:text-base transition"
        >
          <FaNotesMedical size={18} />
          <span className="text-xs">Add Note</span>
        </button>
        {showAddNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#1f1f1f] rounded-xl p-6 w-[90%] max-w-md">
              <h2 className="mb-4 text-lg font-bold text-white">Add Note</h2>

              <textarea
                value={note}
                onChange={(e) => setNoteLocal(e.target.value)}
                placeholder="Type your note here..."
                className="w-full h-28 rounded-lg p-3 bg-[#292929] text-white border border-[#3a3a3a] resize-none"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddNote(false)}
                  className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onsave(note);
                  }}
                  className="px-4 py-2 text-white rounded-lg bg-primary hover:bg-accent"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
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
              className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-3 sm:px-4 md:px-5 py-3 md:py-4 shadow-sm hover:shadow-md transition"
            >
              {/* Item Name & Quantity */}
              <div className="flex items-center justify-between">
                <h1 className="text-[#f5f5f5] font-semibold text-sm sm:text-base md:text-lg truncate">
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
