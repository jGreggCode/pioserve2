/*
 * Licensed Software - Property of John Gregg Felicisimo / JGDDEV
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  getAllDishes,
  deleteDish,
  getCategories,
  editDish,
} from "../../https/index";
import { formatDateAndTime } from "../../utils";

import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import { useState } from "react";

const Dishes = () => {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [editingDish, setEditingDish] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ pagination state
  const itemsPerPage = 5; // ✅ how many dishes per page
  const userData = useSelector((state) => state.user);
  const queryClient = useQueryClient();

  // ✅ Mutation for deleting dish
  const deleteDishMutation = useMutation({
    mutationFn: (id) => deleteDish(id),
    onSuccess: () => {
      enqueueSnackbar("Dish deleted successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to delete dish!", { variant: "error" });
    },
  });

  // ✅ Mutation for editing dish
  const editDishMutation = useMutation({
    mutationFn: ({ dishId, updatedData }) => editDish(dishId, updatedData),
    onSuccess: () => {
      enqueueSnackbar("Dish updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["dishes"]);
      setEditingDish(null);
    },
    onError: () => {
      enqueueSnackbar("Failed to update dish!", { variant: "error" });
    },
  });

  // ✅ Fetch dishes
  const { data: dishes = [], isError } = useQuery({
    queryKey: ["dishes"],
    queryFn: async () => {
      const response = await getAllDishes();
      const allDishes = response.data?.data || response.data || [];
      return Array.isArray(allDishes) ? allDishes : [];
    },
    placeholderData: keepPreviousData,
  });

  // ✅ Fetch categories
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isError) {
    enqueueSnackbar("Something went wrong!", { variant: "error" });
  }

  // ✅ Filter dishes by category + search
  const filteredDishes = dishes
    .filter((dish) => category === "All" || dish.category === category)
    .filter((dish) => {
      const searchLower = search.toLowerCase();
      return (
        dish.name.toLowerCase().includes(searchLower) ||
        dish.description.toLowerCase().includes(searchLower) ||
        String(dish.stock).toLowerCase().includes(searchLower) // ✅ added stock search
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // ✅ Pagination logic
  const indexOfLastDish = currentPage * itemsPerPage;
  const indexOfFirstDish = indexOfLastDish - itemsPerPage;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);
  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = Object.fromEntries(formData.entries());
    editDishMutation.mutate({ dishId: editingDish._id, updatedData });
  };

  return (
    <div className="container mx-auto bg-[#262626] p-4 rounded-lg">
      <div className="flex flex-col items-start justify-between gap-3 px-2 mb-4 md:flex-row md:items-center">
        <h2 className="text-[#f5f5f5] text-xl font-semibold">Dishes</h2>
        <div className="flex flex-col gap-2 md:flex-row">
          {/* ✅ Search Bar */}
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to page 1 on search
            }}
            className="px-4 py-2 text-sm rounded-lg bg-[#2d2d2d] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* ✅ Category Filter */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1); // reset to page 1 on filter
            }}
            className="px-4 py-2 text-sm rounded-lg bg-[#2d2d2d] text-[#f5f5f5] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            {categoriesRes?.data?.data?.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ Table for Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-[#f5f5f5]">
          <thead className="bg-[#333] text-[#ababab]">
            <tr>
              <th className="p-3">Dish ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Category</th>
              <th className="p-3">Sub Category</th>
              <th className="p-3">Price</th>
              {userData.role === "Admin" && (
                <th className="p-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentDishes.map((dish) => (
              <tr
                key={dish._id}
                className="border-b border-gray-600 hover:bg-[#333]"
              >
                <td className="p-4">#{dish._id?.slice(-6)}</td>
                <td className="p-4">{dish.name}</td>
                <td className="p-4">{dish.description}</td>
                <td className="p-4">{dish.stock}</td>
                <td className="p-4">{dish.category}</td>
                <td className="p-4">{dish.subcategory}</td>
                <td className="p-4">&#8369;{dish.price}</td>
                {userData.role === "Admin" && (
                  <td className="flex justify-center gap-2 p-4">
                    <button
                      onClick={() => setEditingDish(dish)}
                      className="px-4 py-2 text-white rounded-lg hover:bg-accent bg-primary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this dish?"
                        );
                        if (confirmDelete) {
                          deleteDishMutation.mutate(dish._id);
                        }
                      }}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination Controls */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "bg-gray-700 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ✅ Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {currentDishes.map((dish) => (
          <div
            key={dish._id}
            className="bg-[#333] p-4 rounded-lg text-[#f5f5f5] shadow-lg"
          >
            <h3 className="text-lg font-semibold">{dish.name}</h3>
            <p className="text-sm text-gray-400">#{dish._id?.slice(-6)}</p>
            <p>Stock: {dish.stock}</p>
            <p>Category: {dish.category}</p>
            <p>Sub: {dish.subcategory}</p>
            <p>₱{dish.price}</p>
            <p className="text-sm text-gray-400">
              {formatDateAndTime(dish.createdAt)}
            </p>
            {userData.role === "Admin" && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setEditingDish(dish)}
                  className="flex-1 px-3 py-2 text-white bg-yellow-600 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this dish?"
                    );
                    if (confirmDelete) {
                      deleteDishMutation.mutate(dish._id);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* ✅ Mobile Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 text-white bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ✅ Modal for Editing */}
      {editingDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1a1a1a] w-full max-w-lg rounded-lg p-6 shadow-lg mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[#f5f5f5] text-xl font-semibold truncate">
                Add Dish
              </h2>
              <button
                onClick={() => setEditingDish(null)}
                className="text-[#f5f5f5] hover:text-red-500 flex-shrink-0"
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Name
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingDish.name}
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Description
                </label>
                <div className="rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <textarea
                    type="text"
                    name="description"
                    defaultValue={editingDish.description}
                    rows={4}
                    className="w-full text-white bg-transparent resize-none focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Price
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    name="price"
                    type="number"
                    step="1"
                    defaultValue={editingDish.price}
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Stock
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    name="stock"
                    type="number"
                    defaultValue={editingDish.stock}
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Category
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <select
                    name="category"
                    defaultValue={editingDish.category}
                    className="flex-1 text-white bg-transparent focus:outline-none"
                  >
                    {categoriesRes?.data?.data?.map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {cat.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#ababab] mb-2 text-sm font-medium">
                  Sub Category
                </label>
                <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                  <input
                    name="subcategory"
                    defaultValue={editingDish.subcategory}
                    className="flex-1 text-white bg-transparent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-yellow-400 rounded-lg hover:bg-yellow-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dishes;
