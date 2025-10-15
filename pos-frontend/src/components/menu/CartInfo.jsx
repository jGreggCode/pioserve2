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
import { removeItem, setItemNote } from "../../redux/slices/cartSlice";
import { useLocation } from "react-router-dom";

const CartInfo = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [noteText, setNoteText] = useState("");
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

  const handleSaveNote = () => {
    if (selectedItem) {
      dispatch(setItemNote({ id: selectedItem.id, note: noteText }));
      setSelectedItem(null);
      setNoteText("");
    }
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const status = searchParams.get("status");

  console.log(status);

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <h1 className="text-base sm:text-lg md:text-xl text-[#f5f5f5] font-bold tracking-wide mb-3">
        Order Details
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
          cartData.map((item, index) => {
            const isReadyOrder = status === "ready";
            const isLockedItem = isReadyOrder && item.isExisting;

            return (
              <div
                key={index}
                className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl px-3 sm:px-4 md:px-5 py-3 md:py-4 shadow-sm hover:shadow-md transition"
              >
                {/* Item header */}
                <div className="flex items-center justify-between">
                  <h1 className="text-[#f5f5f5] font-semibold text-sm sm:text-base md:text-lg truncate">
                    {item.name}
                  </h1>
                  <span className="text-[#e4e4e4] font-medium text-sm bg-[#2a2a2a] px-2 py-0.5 rounded-lg">
                    x{item.quantity}
                  </span>
                </div>

                {/* Item note */}
                {item.note && (
                  <p className="mt-2 text-xs italic text-gray-400 truncate sm:text-sm">
                    “{item.note}”
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => !isLockedItem && handleRemove(item.id)}
                      disabled={isLockedItem}
                      className={`p-2 rounded-lg text-white transition ${
                        isLockedItem
                          ? "bg-gray-700 cursor-not-allowed opacity-60"
                          : "bg-[#292929] hover:bg-red-500"
                      }`}
                    >
                      <RiDeleteBin2Fill size={18} />
                    </button>

                    <button
                      onClick={() => {
                        if (!isLockedItem) {
                          setSelectedItem(item);
                          setNoteText(item.note || "");
                        }
                      }}
                      disabled={isLockedItem}
                      className={`p-2 rounded-lg text-white transition flex items-center gap-1 ${
                        isLockedItem
                          ? "bg-gray-700 cursor-not-allowed opacity-60"
                          : "bg-[#292929] hover:bg-accent"
                      }`}
                    >
                      <FaNotesMedical size={16} />
                      <span className="text-xs sm:text-sm">Note</span>
                    </button>
                  </div>

                  <p className="text-[#f5f5f5] text-md sm:text-lg font-bold">
                    ₱{item.price}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Note Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1f1f1f] rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="mb-4 text-lg font-bold text-white">
              Add Note for {selectedItem.name}
            </h2>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Type your note here..."
              className="w-full h-28 rounded-lg p-3 bg-[#292929] text-white border border-[#3a3a3a] resize-none"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 text-white rounded-lg bg-primary hover:bg-accent"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartInfo;
