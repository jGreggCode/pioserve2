import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDish } from "../../https";
import { enqueueSnackbar } from "notistack";

const AddDishModal = ({ setIsDishModalOpen }) => {
  const queryClient = useQueryClient();
  const [dishData, setDishData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDishData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dishData);
    dishMutation.mutate(dishData);
  };

  const handleCloseModal = () => {
    setIsDishModalOpen(false);
  };

  const dishMutation = useMutation({
    mutationFn: (reqData) => addDish(reqData),
    onSuccess: (res) => {
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
      queryClient.invalidateQueries(["dishes"]); // ✅ refresh dishes list
      setIsDishModalOpen(false);
    },
    onError: (error) => {
      const { data } = error.response;
      enqueueSnackbar(data.message, { variant: "error" });
      console.log(error);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold truncate">
            Add Dish
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500 flex-shrink-0"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Dish Name
            </label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="name"
                value={dishData.name}
                onChange={handleInputChange}
                className="flex-1 text-white bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Dish Description
            </label>
            <div className="rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <textarea
                name="description"
                value={dishData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full text-white bg-transparent resize-none focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Dish Price
            </label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="price"
                value={dishData.price}
                onChange={handleInputChange}
                className="flex-1 text-white bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Dish Stock
            </label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input
                type="number"
                name="stock"
                value={dishData.stock}
                onChange={handleInputChange}
                className="flex-1 text-white bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Dish Category
            </label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="category"
                value={dishData.category}
                onChange={handleInputChange}
                className="flex-1 text-white bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">
              Dish Sub Category
            </label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
              <input
                type="text"
                name="subcategory"
                value={dishData.subcategory}
                onChange={handleInputChange}
                className="flex-1 text-white bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-6 text-lg font-bold text-gray-900 bg-yellow-400 rounded-lg"
          >
            {dishMutation.isLoading ? "Adding..." : "Add Dish"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDishModal;
