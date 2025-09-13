const createHttpError = require("http-errors");
const mongoose = require("mongoose");
const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const Table = require("../models/tableModel");
const User = require("../models/userModel");

// Counting Dishes
const countDishes = async (req, res, next) => {
  try {
    const totalDishes = await Dish.countDocuments();
    res.status(200).json({ success: true, count: totalDishes });
  } catch (error) {
    next(createHttpError(500, "Failed to count dishes"));
  }
};

// Counting Orders
const countOrders = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ success: true, count: totalOrders });
  } catch (error) {
    next(createHttpError(500, "Failed to count orders"));
  }
};

// Counting Tables
const countTables = async (req, res, next) => {
  try {
    const totalTables = await Table.countDocuments();
    res.status(200).json({ success: true, count: totalTables });
  } catch (error) {
    next(createHttpError(500, "Failed to count tables"));
  }
};

// Counting Users
const countUsers = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ success: true, count: totalUsers });
  } catch (error) {
    next(createHttpError(500, "Failed to count users"));
  }
};

const getAllCounts = async (req, res, next) => {
  try {
    const [dishes, orders, tables, users] = await Promise.all([
      Dish.countDocuments(),
      Order.countDocuments(),
      Table.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        dishes,
        orders,
        tables,
        users,
      },
    });
  } catch (error) {
    next(createHttpError(500, "Failed to fetch counts"));
  }
};

// Update User (Admin only)
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (password && password.trim() !== "") {
      user.password = password; // hashing handled by pre("save") hook
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    next(createHttpError(500, "Failed to update user"));
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(createHttpError(400, "Invalid user ID"));
    }

    // find and delete
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(createHttpError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  countDishes,
  countOrders,
  countTables,
  countUsers,
  getAllCounts,
  updateUser,
  deleteUser,
};
