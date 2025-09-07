const createHttpError = require("http-errors");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const addOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res
      .status(201)
      .json({ success: true, message: "Order created!", data: order });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findById(id);
    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Midnight today

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1); // Midnight tomorrow

    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay }
    }).populate("table");

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getTotalOrders = async (req, res, next) => {
  try {
    const orders = await Order.find(
      {}
    ).select('bills.totalWithTax').lean();

    const dailyTotal = orders.reduce((sum, order) => {
      return sum + (order.bills?.totalWithTax || 0);
    }, 0);

    // Format the final total to exactly two decimal places
    const formattedTotal = dailyTotal.toFixed(2);

    res.status(200).json({ success: true, data: { dailyTotal: formattedTotal } });

  } catch (error) {
    next(error);
  }
};

const getTotalOrdersToday = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todayOrders = await Order.find(
      { createdAt: { $gte: startOfDay, $lt: endOfDay } },
    ).select('bills.totalWithTax').lean();

    const startOfYesterday = new Date(startOfDay);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setDate(endOfYesterday.getDate() + 1);

    const yesterdayOrders = await Order.find(
      { createdAt: { $gte: startOfYesterday, $lt: endOfYesterday } },
    ).select('bills.totalWithTax').lean();

    const dailyTotal = todayOrders.reduce((sum, order) => {
      return sum + (order.bills?.totalWithTax || 0);
    }, 0);

    const yesterdayTotal = yesterdayOrders.reduce((sum, order) => {
      return sum + (order.bills?.totalWithTax || 0);
    }, 0);

    // Format both totals to exactly two decimal places
    const formattedDailyTotal = dailyTotal.toFixed(2);
    const formattedYesterdayTotal = yesterdayTotal.toFixed(2);

    res.status(200).json({ 
      success: true, 
      data: { 
        dailyTotal: formattedDailyTotal, 
        yesterdayTotal: formattedYesterdayTotal 
      } 
    });

  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(400, "Invalid or missing order ID!");
      return next(error);
    }

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res.status(200).json({ 
      success: true, 
      message: "Order deleted successfully", 
      data: deletedOrder 
    });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = createHttpError(404, "Invalid id!");
      return next(error);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      const error = createHttpError(404, "Order not found!");
      return next(error);
    }

    res
      .status(200)
      .json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { addOrder, getOrderById, getOrders, updateOrder, getTotalOrders, getTotalOrdersToday, deleteOrder };
