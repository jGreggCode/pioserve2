/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// Icons
import { MdRestaurantMenu, MdTableRestaurant } from "react-icons/md";
import { FaUserAlt, FaShoppingCart, FaFileInvoiceDollar } from "react-icons/fa";

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const { id } = useParams(); // if present, edit mode
  const customerData = useSelector((state) => state.customer);

  return (
    <>
      <section className="bg-[#1f1f1f] min-h-screen xl:h-[calc(100vh-5rem)] flex flex-col xl:flex-row gap-4 overflow-y-auto xl:overflow-hidden p-3 sm:p-4">
        {/* Left Section - Menu and Table Info */}
        <div className="flex-[3] w-full bg-[#1a1a1a] rounded-2xl shadow-lg flex flex-col overflow-hidden">
          {/* Header Section: Adjusted padding for tablet/desktop views */}
          <div className="p-4 sm:p-6 lg:p-4 border-b border-[#2a2a2a] flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="flex items-center gap-4 mb-3 sm:mb-0">
              <BackButton />
              <div className="text-[#f5f5f5]">
                <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                  <MdRestaurantMenu className="text-primary" />
                  Menu List
                </h1>
                <p className="text-xs sm:text-sm text-[#ababab]">
                  Select food and drinks for the current order.
                </p>
              </div>
            </div>
            <div className="bg-[#2a2a2a] text-[#f5f5f5] rounded-lg px-4 py-2 flex items-center gap-2 text-sm sm:text-base">
              <MdTableRestaurant className="text-green-400" />
              <div className="flex items-center gap-1">
                <span className="font-semibold">Table:</span>
                <span className="font-medium">
                  {customerData.tableId || "N/A"}
                </span>
              </div>
              <div className="border-l border-[#4a4a4a] h-5 mx-2"></div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Guests:</span>
                <span className="font-medium">{customerData.guests || 1}</span>
              </div>
            </div>
          </div>

          {/* Menu Content: Added flex-1 and scrollbar-hide for main content area */}
          <div className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-4 scrollbar-hide">
            <MenuContainer />
          </div>
        </div>

        {/* Right Section - Customer, Cart, Bill */}
        {customerData.orderId && (
          <div className="flex-[1] w-full bg-[#1a1a1a] mt-4 xl:mt-0 rounded-2xl shadow-lg flex flex-col overflow-hidden">
            {/* Customer Info Section: Adjusted padding */}
            <div className="p-4 sm:p-6 lg:p-4">
              <div className="flex items-center gap-2 mb-3 text-[#f5f5f5] font-semibold text-lg">
                <FaUserAlt className="text-blue-400" /> Customer Info
              </div>
              <CustomerInfo />
            </div>
            <hr className="border-[#2a2a2a]" />

            {/* Cart Section: Adjusted padding */}
            <div className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-4 scrollbar-hide">
              <div className="flex items-center gap-2 mb-3 text-[#f5f5f5] font-semibold text-lg">
                <FaShoppingCart className="text-green-400" /> Cart
              </div>
              <CartInfo />
            </div>
            <hr className="border-[#2a2a2a]" />

            {/* Bill Section: Adjusted padding */}
            <div className="p-4 sm:p-6 lg:p-4">
              <div className="flex items-center gap-2 mb-3 text-[#f5f5f5] font-semibold text-lg">
                <FaFileInvoiceDollar className="text-yellow-400" /> Bill
              </div>
              <Bill editMode={!!id} />
            </div>
          </div>
        )}
      </section>
      <div className="flex mt-10 mb-10"></div>
      <BottomNav />
    </>
  );
};

export default Menu;
