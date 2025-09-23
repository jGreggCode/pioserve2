/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { getDish } from "../../https";
import { enqueueSnackbar } from "notistack";

// Icons
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart, FaSearch, FaTimes } from "react-icons/fa";

const MenuContainer = () => {
  const [menus, setMenus] = useState([]);
  const [selected, setSelected] = useState(null);
  const [counts, setCounts] = useState({});
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const dispatch = useDispatch();

  // Fetch menus from backend
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await getDish();
        // console.log("API response:", JSON.stringify(res.data.data, null, 2));
        if (res.data.success) {
          const formatted = res.data.data.map((cat, index) => ({
            id: index + 1,
            name: cat._id, // category name
            bgColor: "#f56f21",
            icon: "",
            items: cat.subcategories.flatMap((sub) =>
              sub.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                stock: item.stock,
                category: item.category,
              }))
            ),
          }));

          setMenus(formatted);
          setSelected(formatted[0]);
        }
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    };

    fetchMenus();
  }, []);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        setFilteredItems(selected?.items || []);
      } else {
        const allItems = menus.flatMap((menu) => menu.items);
        const matches = allItems.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredItems(matches);
      }
    }, 300); // ⏱ debounce 300ms

    return () => clearTimeout(timer);
  }, [search, selected, menus]);

  const increment = (id, stock) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      if (current < stock) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  };

  const decrement = (id) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      if (current > 0) {
        return { ...prev, [id]: current - 1 };
      }
      return prev;
    });
  };

  const handleOutOFStock = (itemName) => {
    enqueueSnackbar(`${itemName} is out of stock!`, { variant: "warning" });
  };

  const handleAddToCart = (item) => {
    const quantity = counts[item.id] || 0;
    if (quantity === 0) return;

    const { id, name, price, stock } = item;
    const newObj = {
      id,
      name,
      stock,
      pricePerQuantity: price,
      quantity,
      price: price * quantity,
    };

    dispatch(addItems(newObj));
    setCounts((prev) => ({ ...prev, [item.id]: 0 }));
  };

  return (
    <>
      {/* Search Bar */}
      <div className="px-4 mt-4 sm:px-6 lg:px-10">
        <div className="relative w-full">
          <FaSearch className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#1a1a1a] text-white border border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute text-gray-400 transition -translate-y-1/2 right-3 top-1/2 hover:text-white"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10 py-4 w-full h-[200px] overflow-y-auto scrollbar-hide">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className={`flex flex-col items-start justify-between p-4 rounded-xl h-[100px] cursor-pointer border shadow-sm transition 
          ${
            selected?.id === menu.id
              ? "border-primary bg-[#2a2a2a]"
              : "border-[#2a2a2a] bg-[#1f1f1f] hover:bg-[#2a2a2a]"
          }`}
            onClick={() => {
              setSelected(menu);
              if (search.trim() === "") setFilteredItems(menu.items); // reset when switching
            }}
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold flex items-center gap-2">
                {menu.icon} {menu.name}
              </h1>
              {selected?.id === menu.id && (
                <GrRadialSelected className="text-primary" size={20} />
              )}
            </div>
            <p className="text-[#ababab] text-sm font-medium">
              {menu.items.length} Items
            </p>
          </div>
        ))}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      {/* Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10 py-4 w-full h-[500px] overflow-y-auto scrollbar-hide">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const currentCount = counts[item.id] || 0;
            return (
              <div
                key={item.id}
                className="flex flex-col items-start justify-between p-4 rounded-xl h-[170px] cursor-pointer hover:shadow-lg hover:border-primary bg-[#1a1a1a] border border-[#2a2a2a] transition"
              >
                {/* Name + Add-to-Cart */}
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h1 className="text-[#f5f5f5] text-lg font-semibold truncate">
                      {item.name}
                    </h1>
                    <p className="text-[#ababab] text-sm italic">
                      {item.category}
                    </p>
                  </div>
                  {item.stock === 0 ? (
                    <button
                      onClick={() => handleOutOFStock(item.name)}
                      className="p-2 rounded-lg bg-[#2e2e2e] text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      <FaShoppingCart size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="p-2 rounded-lg bg-[#2e2e2e] text-green-400 hover:bg-green-500 hover:text-white transition"
                    >
                      <FaShoppingCart size={18} />
                    </button>
                  )}
                </div>

                {/* Price + Counter */}
                <div className="flex items-center justify-between w-full mt-3">
                  <p className="text-[#f5f5f5] text-lg font-bold">
                    &#8369;{item.price}
                  </p>
                  <div className="flex items-center justify-between bg-[#2a2a2a] px-4 py-2 rounded-lg gap-6 w-[50%]">
                    <button
                      disabled={currentCount === 0}
                      onClick={() => decrement(item.id)}
                      className={`text-xl font-bold transition ${
                        currentCount === 0
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-primary hover:text-accent"
                      }`}
                    >
                      &minus;
                    </button>
                    <span className="font-medium text-white">
                      {currentCount}
                    </span>
                    <button
                      disabled={currentCount >= item.stock}
                      onClick={() => increment(item.id, item.stock)}
                      className={`text-xl font-bold transition ${
                        currentCount >= item.stock
                          ? "text-gray-600 cursor-not-allowed"
                          : "text-primary hover:text-accent"
                      }`}
                    >
                      &#43;
                    </button>
                  </div>
                </div>

                {/* Stock Info */}
                <p className="mt-2 text-xs text-gray-400">
                  {item.stock - currentCount} left in stock
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-[#ababab] col-span-full">
            No items found
          </p>
        )}
      </div>
    </>
  );
};

export default MenuContainer;
