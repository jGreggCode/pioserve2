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
    <section className="bg-[#1f1f1f] min-h-screen lg:h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-4 overflow-y-auto lg:overflow-hidden p-2 sm:p-4">
      {/* Left Section */}
      <div className="flex-[3] w-full bg-[#1a1a1a] rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-10 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3 sm:gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wide flex items-center gap-2">
              <MdRestaurantMenu className="text-primary" />
              Menu
            </h1>
          </div>

          {/* Customer Info (Top Right) */}
          <div className="flex items-center gap-3 bg-[#292929] px-4 py-2 rounded-xl shadow hover:bg-[#333] transition">
            <MdRestaurantMenu className="text-[#f5f5f5] text-3xl sm:text-4xl" />
            <div className="flex flex-col items-start">
              <h1 className="text-sm sm:text-md text-[#f5f5f5] font-semibold tracking-wide">
                {customerData.customerName || "N/A"}
              </h1>
              <p className="text-xs text-[#ababab] font-medium flex items-center gap-1">
                <MdTableRestaurant className="text-[#ababab]" />
                {customerData.table?.tableNo == 0
                  ? "Take Out"
                  : customerData.table?.tableNo}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="p-4 sm:p-6">
          <MenuContainer />
        </div>
      </div>

      {/* Right Section */}
      {customerData.orderId && (
        <div className="flex-[1] mb-28 w-full lg:w-auto bg-[#1a1a1a] mt-2 lg:mt-4 lg:mr-3 h-auto lg:h-[780px] rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 text-[#f5f5f5] font-semibold">
              <FaUserAlt className="text-blue-400" /> Customer Info
            </div>
            <CustomerInfo />
          </div>
          <hr className="border-[#2a2a2a]" />

          <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-2 mb-3 text-[#f5f5f5] font-semibold">
              <FaShoppingCart className="text-green-400" /> Cart
            </div>
            <CartInfo />
          </div>
          <hr className="border-[#2a2a2a]" />

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3 text-[#f5f5f5] font-semibold">
              <FaFileInvoiceDollar className="text-primary" /> Bill
            </div>
            <Bill editMode={Boolean(id)} /> {/* ✅ pass edit flag */}
          </div>
        </div>
      )}

      {/* Bottom Nav (Always Visible) */}
      <BottomNav />
    </section>
  );
};

export default Menu;
