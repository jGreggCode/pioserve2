const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const Dish = require("../models/dishModel");
const Table = require("../models/tableModel");
const User = require("../models/userModel");

// /api/metrics?range=today|week|month|year OR custom with from & to
router.get("/", async (req, res) => {
  try {
    const { range, from, to } = req.query;

    // Compute start & end dates
    let startDate, endDate;
    const now = new Date();

    switch (range) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date();
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date();
        break;
      case "custom":
        startDate = new Date(from);
        endDate = new Date(to);
        break;
      default: // today
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    // 1. Orders in range
    const orders = await Order.find({
      orderDate: { $gte: startDate, $lte: endDate },
    });

    // compute totals
    const paidOrders = orders.filter((o) => o.orderStatus === "Paid");
    const unpaidOrders = orders.filter((o) => o.orderStatus !== "Paid");

    const paidTotal = paidOrders.reduce(
      (acc, o) => acc + o.bills.totalWithTax,
      0
    );
    const unpaidTotal = unpaidOrders.reduce(
      (acc, o) => acc + o.bills.totalWithTax,
      0
    );

    // 2. Count all resources
    const dishesCount = await Dish.countDocuments();
    const tablesCount = await Table.countDocuments();
    const usersCount = await User.countDocuments();

    res.json({
      success: true,
      data: {
        paidTotal,
        unpaidTotal,
        overallTotal: paidTotal + unpaidTotal,
        ordersCount: orders.length,
        customersCount: new Set(orders.map((o) => o.customerDetails.phone))
          .size,
        resources: {
          dishes: dishesCount,
          orders: orders.length,
          tables: tablesCount,
          users: usersCount,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
