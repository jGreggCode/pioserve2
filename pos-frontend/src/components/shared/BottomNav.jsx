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
    if (!name || !guestCount) {
      enqueueSnackbar("Fields Cannot Be Empty", { variant: "error" });
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
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around z-50 shadow-lg">
      {/* Home */}
      <button
        onClick={() => navigate("/")}
        className={`flex flex-1 items-center justify-center font-bold py-2 mx-1 rounded-[20px] transition ${
          isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
      >
        <FaHome size={22} />
        <span className="hidden ml-2 sm:inline">Home</span>
      </button>

      {/* Orders */}
      <button
        onClick={() => navigate("/orders")}
        className={`flex flex-1 items-center justify-center font-bold py-2 mx-1 rounded-[20px] transition ${
          isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
      >
        <MdOutlineReorder size={22} />
        <span className="hidden ml-2 sm:inline">Orders</span>
      </button>

      {/* Tables */}
      <button
        onClick={() => navigate("/tables")}
        className={`flex flex-1 items-center justify-center font-bold py-2 mx-1 rounded-[20px] transition ${
          isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
      >
        <MdTableBar size={22} />
        <span className="hidden ml-2 sm:inline">Tables</span>
      </button>

      {/* More */}
      {/* <button className="flex flex-1 items-center justify-center font-bold text-[#ababab] py-2 mx-1 rounded-[20px] transition">
        <CiCircleMore size={22} />
        <span className="hidden ml-2 sm:inline">Menu</span>
      </button> */}
      <button
        onClick={() => navigate("/menu")}
        className={`flex flex-1 items-center justify-center font-bold py-2 mx-1 rounded-[20px] transition ${
          isActive("/menu") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"
        }`}
      >
        <IoFastFood size={22} />
        <span className="hidden ml-2 sm:inline">Menu</span>
      </button>

      {/* Floating Action (Dish Button) */}
      <button
        disabled={isActive("/tables") || isActive("/menu")}
        onClick={openModal}
        className="absolute bottom-8 bg-[#F6B100] text-[#f5f5f5] rounded-full p-4 shadow-lg"
      >
        <BiSolidDish size={32} />
      </button>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Order">
        <div>
          <label className="block text-[#ababab] mb-2 text-sm font-medium">
            Customer Name
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter customer name"
              className="flex-1 text-white bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
            Customer Phone
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
            <h2 className="text-white">+63 | </h2>
            <input
              value={phone}
              onChange={handleInputChange}
              type="tel"
              placeholder="9917822877"
              className="flex-1 py-3 pl-2 text-white bg-transparent focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 mt-3 text-sm font-medium text-[#ababab]">
            Guest
          </label>
          <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
            <button onClick={decrement} className="text-2xl text-yellow-500">
              &minus;
            </button>
            <span className="text-white">{guestCount} Person</span>
            <button onClick={increment} className="text-2xl text-yellow-500">
              &#43;
            </button>
          </div>
        </div>

        <button
          onClick={handleCreateOrder}
          className="w-full bg-[#F6B100] text-[#f5f5f5] rounded-lg py-3 mt-8 hover:bg-yellow-700"
        >
          Create Order
        </button>
      </Modal>
    </div>
  );
};

export default BottomNav;
