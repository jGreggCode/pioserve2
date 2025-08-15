import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import Modal from "../components/dashboard/Modal";
import AddDishModal from "../components/dashboard/AddDishModal"
import { useSelector } from "react-redux";

const buttons = [
  { id: 1, label: "Add Table", icon: <MdTableBar />, action: "table" },
  { id: 2, label: "Add Category", icon: <MdCategory />, action: "category" },
  { id: 3, label: "Add Dishes", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Metrics", "Orders", "Payments"];
const chefTabs = ["Orders"];

const Dashboard = () => {
  const userData = useSelector((state) => state.user);
  let isChef = false;

  if (userData.role === "Chef") {
    isChef = true;
  }

  useEffect(() => {
    document.title = "Pioserve | Admin Dashboard";
  }, []);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("Metrics");

  const handleOpenModal = (action) => {
    if (action === "table") setIsTableModalOpen(true);
    if (action === "dishes") setIsAddDishModalOpen(true);
  };

  return (
    <>
      {isChef ? (
        <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
          <div className="container mx-auto flex items-center justify-between py-14 md:px-4">
            <div className="text-white container mx-auto">
              <h1 className="text-2xl">Orders</h1>
            </div>
          </div>

          <RecentOrders />
        </div>
      ) : (
        <div className="bg-[#1f1f1f] h-[calc(100vh-5rem)]">
          <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
            <div className="flex items-center gap-3">
              {buttons.map(({ label, icon, action, id}) => {
                return (
                  <button
                    key={id}
                    onClick={() => handleOpenModal(action)}
                    className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2"
                  >
                    {label} {icon}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {tabs.map((tab, index) => {
                return (
                  <button
                    key={index}
                    className={`
                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 ${
                  activeTab === tab
                    ? "bg-[#262626]"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
                }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "Metrics" && <Metrics />}
          {activeTab === "Orders" && <RecentOrders />}
          {activeTab === "Payments" && (
            <div className="text-white p-6 container mx-auto">
              Payment Component Coming Soon
            </div>
          )}

          {isTableModalOpen && (
            <Modal setIsTableModalOpen={setIsTableModalOpen} />
          )}
          {isAddDishModalOpen && (
            <AddDishModal setIsDishModalOpen={setIsAddDishModalOpen} />
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
