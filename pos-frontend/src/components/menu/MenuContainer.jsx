import { useEffect, useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { getDish } from "../../https";

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
        console.log("API response:", JSON.stringify(res.data.data, null, 2));
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
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1a1a1a] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 flex items-center text-gray-400 right-3 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-10 py-4 w-full h-[200px] overflow-y-auto scrollbar-hide">
        {menus.map((menu) => (
          <div
            key={menu.id}
            className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer"
            style={{ backgroundColor: menu.bgColor }}
            onClick={() => {
              setSelected(menu);
              if (search.trim() === "") setFilteredItems(menu.items); // reset when switching
            }}
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="text-[#f5f5f5] text-lg font-semibold">
                {menu.icon} {menu.name}
              </h1>
              {selected?.id === menu.id && (
                <GrRadialSelected className="text-white" size={20} />
              )}
            </div>
            <p className="text-[#f5f5f5] text-sm font-semibold">
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
                className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2a2a2a] bg-[#1a1a1a]"
              >
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h1 className="text-[#f5f5f5] text-lg font-semibold">
                      {item.name}
                    </h1>
                    <p className="text-[#f5f5f5] text-sm italic">
                      {item.category}
                    </p>
                  </div>
                  {item.stock === 0 ? (
                    <span className="text-sm font-semibold text-red-500">
                      Out of Stock
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-[#2e4a40] text-[#02ca3a] p-2 rounded-lg"
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between w-full">
                  <p className="text-[#f5f5f5] text-xl font-bold">
                    &#8369;{item.price}
                  </p>
                  <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg gap-6 w-[50%]">
                    <button
                      disabled={currentCount === 0}
                      onClick={() => decrement(item.id)}
                      className={`text-2xl ${
                        currentCount === 0 ? "text-gray-600" : "text-yellow-500"
                      }`}
                    >
                      &minus;
                    </button>
                    <span className="text-white">{currentCount}</span>
                    <button
                      disabled={currentCount >= item.stock}
                      onClick={() => increment(item.id, item.stock)}
                      className={`text-2xl ${
                        currentCount >= item.stock
                          ? "text-gray-600"
                          : "text-yellow-500"
                      }`}
                    >
                      &#43;
                    </button>
                  </div>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {item.stock - currentCount} left in stock
                </p>
              </div>
            );
          })
        ) : (
          <p className="text-center text-white col-span-full">No items found</p>
        )}
      </div>
    </>
  );
};

export default MenuContainer;
