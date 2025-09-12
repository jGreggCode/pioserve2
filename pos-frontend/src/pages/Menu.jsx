import { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const { id } = useParams(); // if present, edit mode
  const customerData = useSelector((state) => state.customer);

  return (
    <section className="bg-[#1f1f1f] min-h-screen lg:h-[calc(100vh-5rem)] flex flex-col lg:flex-row gap-3 overflow-y-auto lg:overflow-hidden">
      {/* Left Div */}
      <div className="flex-[3] w-full">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-2 sm:gap-4">
            <BackButton />
            <h1 className="text-[#f5f5f5] text-xl sm:text-2xl font-bold tracking-wider">
              Menu
            </h1>
          </div>
          <div className="flex items-center justify-around gap-2 sm:gap-4">
            <div className="flex items-center gap-2 cursor-pointer sm:gap-3">
              <MdRestaurantMenu className="text-[#f5f5f5] text-3xl sm:text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-sm sm:text-md text-[#f5f5f5] font-semibold tracking-wide">
                  {customerData.customerName || "Customer Name"}
                </h1>
                <p className="text-xs text-[#ababab] font-medium">
                  Table : {customerData.table?.tableNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <MenuContainer />
      </div>

      {/* Right Div */}
      <div className="flex-[1] mb-28 w-full lg:w-auto bg-[#1a1a1a] mt-2 lg:mt-4 lg:mr-3 h-auto lg:h-[780px] rounded-lg pt-2">
        <CustomerInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        <CartInfo />
        <hr className="border-[#2a2a2a] border-t-2" />
        <Bill editMode={Boolean(id)} /> {/* ✅ pass edit flag */}
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
