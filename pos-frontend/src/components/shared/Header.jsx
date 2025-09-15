/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOut } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center py-4 px-4 md:px-8 bg-[#1a1a1a] gap-4 md:gap-0">
      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <img src={logo} className="w-8 h-8 md:w-10 md:h-10" alt="restro logo" />
        <h1 className="text-lg md:text-xl font-semibold text-[#f5f5f5] tracking-wide">
          Pioserve
        </h1>
      </div>

      {/* LOGGED USER DETAILS */}
      <div className="flex flex-wrap items-center justify-end gap-4 md:gap-6 md:flex-nowrap">
        {userData.role === "Admin" && (
          <div
            onClick={() => navigate("/dashboard")}
            className="bg-[#1f1f1f] rounded-xl p-3 cursor-pointer hover:bg-[#2a2a2a] transition-colors duration-200"
          >
            <MdDashboard className="text-[#f5f5f5] text-2xl md:text-3xl" />
          </div>
        )}

        <div className="flex items-center gap-3 cursor-pointer md:gap-2">
          <FaUserCircle className="text-[#f5f5f5] text-3xl md:text-4xl" />

          <div className="flex flex-col items-start text-left md:items-start">
            <h1 className="text-sm md:text-md text-[#f5f5f5] font-semibold tracking-wide truncate max-w-[120px] md:max-w-[200px]">
              {userData.name || "TEST USER"}
            </h1>
            <p className="text-xs md:text-sm text-[#ababab] font-medium">
              {userData.role || "Role"}
            </p>
          </div>

          <IoLogOut
            onClick={handleLogout}
            className="text-[#f5f5f5] ml-1 md:ml-2 hover:text-red-500 transition-colors duration-200"
            size={30}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
