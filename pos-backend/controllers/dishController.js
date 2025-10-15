/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const mongoose = require("mongoose");
const createHttpError = require("http-errors");

const addDish = async (req, res, next) => {
  try {
    var { name, price, description, stock, category, subcategory } = req.body;
    if (!name || !price || !category || !stock) {
      const error = createHttpError(400, "Fields cannot be empty!");
      return next(error);
    }
    const isDishPresent = await Dish.findOne({ name });

    if (isDishPresent) {
      const error = createHttpError(400, "Dish already exist!");
      return next(error);
    }

    if (!subcategory) subcategory = "N/A";

    const newDish = new Dish({
      name,
      price,
      description,
      stock,
      category,
      subcategory,
    });
    await newDish.save();
    res
      .status(201)
      .json({ success: true, message: "Dish added!", data: newDish });
  } catch (error) {
    next(error);
  }
};

const editDish = async (req, res, next) => {
  try {
    const { dishId } = req.params;
    const { name, price, description, stock, category, subcategory } = req.body;

    if (!mongoose.Types.ObjectId.isValid(dishId)) {
      const error = createHttpError(400, "Invalid Dish ID!");
      return next(error);
    }

    // Validate required fields
    if (!name || !price || !category) {
      const error = createHttpError(400, "Fields cannot be empty!");
      return next(error);
    }

    const dish = await Dish.findById(dishId);

    if (!dish) {
      const error = createHttpError(404, "Dish not found!");
      return next(error);
    }

    // Prevent duplicate dish name (excluding current dish)
    const existingDish = await Dish.findOne({ name, _id: { $ne: dishId } });
    if (existingDish) {
      const error = createHttpError(400, "Dish with this name already exists!");
      return next(error);
    }

    // Update dish
    dish.name = name;
    dish.price = price;
    dish.stock = stock;
    dish.description = description;
    dish.category = category;
    dish.subcategory = subcategory || "N/A";

    const updatedDish = await dish.save();

    res.status(200).json({
      success: true,
      message: "Dish updated successfully!",
      data: updatedDish,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(400, "Invalid or missing dish ID!");
      return next(error);
    }

    const deleteDish = await Dish.findByIdAndDelete(id);

    if (!deleteDish) {
      const error = createHttpError(404, "Dish not found!");
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Dish deleted successfully",
      data: deleteDish,
    });
  } catch (error) {
    next(error);
  }
};

const getDishes = async (req, res, next) => {
  try {
    // Group by category -> subcategory
    const dishes = await Dish.aggregate([
      {
        $group: {
          _id: { category: "$category", subcategory: "$subcategory" },
          items: {
            $push: {
              id: "$_id",
              name: "$name",
              price: "$price",
              stock: "$stock",
              category: "$subcategory", // frontend shows this
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.category",
          subcategories: {
            $push: {
              name: "$_id.subcategory",
              items: "$items",
            },
          },
        },
      },
    ]);

    res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    next(error);
  }
};

const getAllDishes = async (req, res, next) => {
  try {
    const { startDate } = req.query;

    // Step 1: Normalize date to a full-day range
    let start;
    let end;

    if (startDate) {
      // If startDate is provided, set the range to that single day
      start = new Date(startDate);
      end = new Date(startDate);
    } else {
      // If no date is provided, default to today's date range
      start = new Date();
      end = new Date();
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    // Step 2: Fetch only PAID orders within date range
    const orders = await Order.find({
      orderStatus: "Paid",
      orderDate: { $gte: start, $lte: end },
    }).lean();

    // Step 3: Aggregate per dish (only from this range)
    const soldStats = {};

    for (const order of orders) {
      for (const item of order.items) {
        const dishId = item.id?.toString();
        if (!dishId) continue;

        if (!soldStats[dishId]) {
          soldStats[dishId] = {
            quantitySold: 0,
            lastStockAtSale: item.stock,
            lastSoldDate: order.orderDate,
          };
        }

        soldStats[dishId].quantitySold += item.quantity;

        // Update stock if this sale is newer
        if (order.orderDate > soldStats[dishId].lastSoldDate) {
          soldStats[dishId].lastStockAtSale = item.stock;
          soldStats[dishId].lastSoldDate = order.orderDate;
        }
      }
    }

    // Step 4: Fetch all dishes
    const dishes = await Dish.find().lean();

    // Step 5: Enrich each dish with current period sales only
    const enriched = dishes.map((dish) => {
      const info = soldStats[dish._id.toString()];
      return {
        ...dish,
        quantitySold: info?.quantitySold || 0,
        stockAtSale: info ? info.lastStockAtSale : "No Sale",
      };
    });

    return res.status(200).json({ data: enriched });
  } catch (error) {
    console.error("Error in getAllDishes:", error);
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    // Get unique categories with their subcategories
    const categories = await Dish.aggregate([
      {
        $group: {
          _id: "$category",
          subcategories: { $addToSet: "$subcategory" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          subcategories: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get Top 10 Dishes
const getTopDishes = async (req, res, next) => {
  try {
    const topDishes = await Order.aggregate([
      { $unwind: "$items" }, // expand items array
      {
        $group: {
          _id: "$items.id", // group by the dish id string
          name: { $first: "$items.name" }, // get dish name
          totalOrdered: { $sum: "$items.quantity" }, // sum quantities
          totalRevenue: { $sum: "$items.price" }, // sum revenue if needed
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      message: "Top 10 dishes fetched successfully",
      data: topDishes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDish,
  editDish,
  getDishes,
  deleteDish,
  getAllDishes,
  getCategories,
  getTopDishes,
};
