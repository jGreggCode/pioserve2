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
    // Find all orders in the database without any date-based filtering.
    // We use .select() to retrieve only the 'bills.totalWithTax'
    // field for efficiency. We also use .lean() to get a plain JavaScript object
    // for faster processing, since we don't need Mongoose document methods.
    const orders = await Order.find(
      {}
    ).select('bills.totalWithTax').lean();

    // Use the reduce method to sum the 'totalWithTax' from all orders.
    // The initial value for the accumulator is 0.
    const dailyTotal = orders.reduce((sum, order) => {
      // Add a safety check to ensure totalWithTax exists and is a number.
      // We use optional chaining (?.) and logical OR (|| 0) to safely
      // handle cases where 'bills' or 'totalWithTax' might be missing.
      return sum + (order.bills?.totalWithTax || 0);
    }, 0); // The 0 is the initial value for `sum`

    // Respond with a 200 status and the calculated total.
    res.status(200).json({ success: true, data: { dailyTotal } });

  } catch (error) {
    // If any error occurs, pass it to the next middleware.
    next(error);
  }
};

const getTotalOrdersToday = async (req, res, next) => {
  try {
    // Calculate the start and end of the current day.
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Midnight today

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1); // Midnight tomorrow

    // Find all orders for the current day. We use .find() to get all matching
    // documents and then use .select() to retrieve only the 'bills.totalWithTax'
    // field for efficiency. We also use .lean() to get a plain JavaScript object
    // for faster processing, since we don't need Mongoose document methods.
    const todayOrders = await Order.find(
      { createdAt: { $gte: startOfDay, $lt: endOfDay } },
    ).select('bills.totalWithTax').lean();

    // Calculate the start and end of yesterday.
    const startOfYesterday = new Date(startOfDay);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1); // Midnight yesterday

    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setDate(endOfYesterday.getDate() + 1); // Midnight today

    // Find all orders for yesterday.
    const yesterdayOrders = await Order.find(
      { createdAt: { $gte: startOfYesterday, $lt: endOfYesterday } },
    ).select('bills.totalWithTax').lean();

    // Use the reduce method to sum the 'totalWithTax' from all today's orders.
    // The initial value for the accumulator is 0.
    const dailyTotal = todayOrders.reduce((sum, order) => {
      // Add a safety check to ensure totalWithTax exists and is a number.
      return sum + (order.bills?.totalWithTax || 0);
    }, 0); // The 0 is the initial value for `sum`

    // Use the reduce method to sum the 'totalWithTax' from all yesterday's orders.
    const yesterdayTotal = yesterdayOrders.reduce((sum, order) => {
      // Add a safety check to ensure totalWithTax exists and is a number.
      return sum + (order.bills?.totalWithTax || 0);
    }, 0); // The 0 is the initial value for `sum`

    // Respond with a 200 status and the calculated totals.
    res.status(200).json({ success: true, data: { dailyTotal, yesterdayTotal } });

  } catch (error) {
    // If any error occurs, pass it to the next middleware.
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

module.exports = { addOrder, getOrderById, getOrders, updateOrder, getTotalOrders, getTotalOrdersToday };
