/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { IoFastFood } from "react-icons/io5";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  };
  const decrement = () => {
    if (guestCount <= 0) return;
    setGuestCount((prev) => prev - 1);
  };

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    if (!guestCount) {
      enqueueSnackbar("Guest cannot be zero", { variant: "error" });
      return;
    }
    dispatch(setCustomer({ name, phone, guests: guestCount }));
    navigate("/tables");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    const isNumber = /^\d*$/.test(value);
    const isWithinLength = value.length <= 11;
    if (isNumber && isWithinLength) {
      setPhone(value);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around items-center z-50 shadow-lg">
      {/* Navigation Buttons */}
      {[
        { path: "/", icon: <FaHome size={22} />, label: "Home" },
        {
          path: "/orders",
          icon: <MdOutlineReorder size={22} />,
          label: "Orders",
        },
        { path: "/tables", icon: <MdTableBar size={22} />, label: "Tables" },
        { path: "/menu", icon: <IoFastFood size={22} />, label: "Menu" },
      ].map(({ path, icon, label }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`flex flex-1 flex-col items-center justify-center py-2 mx-1 rounded-[20px] transition-all duration-200 ${
            isActive(path)
              ? "text-white bg-[#343434] scale-105 shadow-md"
              : "text-[#ababab] hover:text-white hover:bg-[#2a2a2a]"
          }`}
        >
          {icon}
          <span className="hidden mt-1 text-xs font-medium sm:inline">
            {label}
          </span>
        </button>
      ))}

      {/* Floating Action Button */}
      <button
        disabled={isActive("/tables") || isActive("/menu")}
        onClick={openModal}
        className="absolute p-4 text-white transition-transform duration-300 transform -translate-x-1/2 rounded-full shadow-xl -top-6 left-1/2 bg-primary hover:scale-110"
      >
        <BiSolidDish size={32} />
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div className="flex flex-col gap-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-[#ababab] mb-2">
              Customer Name (Optional)
            </label>
            <div className="flex items-center bg-[#1f1f1f] rounded-lg px-4 py-3">
              <input
                type="text"
                placeholder="Enter customer name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 text-white bg-transparent focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-[#ababab] mb-2 mt-3">
              Customer Phone (Optional)
            </label>
            <div className="flex items-center bg-[#1f1f1f] rounded-lg px-4 py-3 gap-2">
              <span className="text-white">+63 |</span>
              <input
                type="tel"
                placeholder="9917822877"
                value={phone}
                onChange={handleInputChange}
                className="flex-1 text-white bg-transparent focus:outline-none placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium text-[#ababab] mb-2 mt-3">
              Guest
            </label>
            <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
              <button
                onClick={decrement}
                className="text-2xl text-yellow-500 transition-colors hover:text-yellow-400"
              >
                &minus;
              </button>
              <span className="font-medium text-white">
                {guestCount} Person{guestCount > 1 ? "s" : ""}
              </span>
              <button
                onClick={increment}
                className="text-2xl text-yellow-500 transition-colors hover:text-yellow-400"
              >
                &#43;
              </button>
            </div>
          </div>

          {/* Create Order Button */}
          <button
            onClick={handleCreateOrder}
            className="w-full py-3 mt-6 font-semibold text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
          >
            Create Order
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BottomNav;
