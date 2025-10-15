/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const createHttpError = require("http-errors");
const Dish = require("../models/dishModel");
const Order = require("../models/orderModel");
const { default: mongoose } = require("mongoose");

const addOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, table, discounts } = req.body;

    // --- Validate stock ---
    for (const item of items) {
      const dish = await Dish.findById(item.id).session(session);
      if (!dish) throw createHttpError(404, `Dish not found: ${item.name}`);
      if (dish.stock < item.quantity) {
        throw createHttpError(
          400,
          `${dish.name} has only ${dish.stock} left in stock`
        );
      }
    }

    const isTakeOut = !table || table === "0" || table === 0;

    const order = new Order({
      ...req.body,
      discounts: discounts || [],
      table: isTakeOut ? null : table,
      isTakeOut,
    });

    await order.save({ session });

    // --- Decrement stock ---
    for (const item of items) {
      await Dish.findByIdAndUpdate(
        item.id,
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Order created successfully!",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// ✅ Update only the items of an order
const updateOrderItems = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { items, bills, orderStatus } = req.body;

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw createHttpError(404, "Order not found!");
    }

    // 🔹 Step 1: Restore stock for old items
    for (const oldItem of order.items) {
      await Dish.findByIdAndUpdate(
        oldItem.id,
        { $inc: { stock: oldItem.quantity } },
        { session }
      );
    }

    // 🔹 Step 2: Validate new items
    for (const item of items) {
      const dish = await Dish.findById(item.id).session(session);
      if (!dish) {
        throw createHttpError(404, `Dish not found: ${item.name}`);
      }
      if (dish.stock < item.quantity) {
        throw createHttpError(
          400,
          `${dish.name} has only ${dish.stock} left in stock`
        );
      }
    }

    // 🔹 Step 3: Deduct stock for new items
    for (const item of items) {
      await Dish.findByIdAndUpdate(
        item.id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // 🔹 Step 4: Update the order
    order.items = items;
    if (bills) {
      order.bills = bills;
    }
    if (orderStatus) order.orderStatus = orderStatus;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ success: true, message: "Order items updated!", data: order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Add Discount
const updateOrderDiscount = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { discounts } = req.body;

    if (!Array.isArray(discounts)) {
      throw createHttpError(400, "Discounts must be an array");
    }

    // Fetch order
    const order = await Order.findById(id).session(session);
    if (!order) throw createHttpError(404, "Order not found");

    // Normalize & validate incoming discounts
    const validDiscounts = discounts
      .map((d) => ({
        type: d?.type,
        cardId: d?.cardId,
        discountValue:
          d?.discountValue !== undefined ? Number(d.discountValue) : NaN,
      }))
      .filter(
        (d) =>
          d &&
          (d.type === "Senior" || d.type === "PWD") &&
          d.cardId &&
          !isNaN(d.discountValue) &&
          d.discountValue >= 0
      );

    // Compute highest discount percent and how many valid discounts applied
    const discountCount = validDiscounts.length;
    const maxDiscountPercent =
      discountCount > 0
        ? Math.max(...validDiscounts.map((d) => Number(d.discountValue)))
        : 0;

    // Guard: use stored order.bills.total (assumed subtotal pre-tax)
    const originalTotal = Number(order.bills?.total || 0);
    const guests = Number(order.customerDetails?.guests || 1);
    const perHead = guests > 0 ? originalTotal / guests : originalTotal;

    // Algorithm: perHead * (maxPercent/100) * numberOfDiscountedGuests
    const discountAmount = Number(
      (perHead * (maxDiscountPercent / 100) * discountCount).toFixed(2)
    );

    // Subtotal after discount
    const discountedSubtotal = Number(
      (originalTotal - discountAmount).toFixed(2)
    );

    // Recompute tax proportionally using original tax / originalTotal ratio
    // (fallback to 0 if originalTotal is zero)
    let newTax = 0;
    if (originalTotal > 0) {
      const originalTax = Number(order.bills?.tax || 0);
      const taxRateFraction = originalTax / originalTotal; // e.g. 0.0525
      newTax = Number((discountedSubtotal * taxRateFraction).toFixed(2));
    } else {
      newTax = 0;
    }

    const newTotalWithTax = Number((discountedSubtotal + newTax).toFixed(2));

    // Persist
    order.discounts = validDiscounts;
    order.bills.discountPercent = maxDiscountPercent;
    order.bills.discountAmount = discountAmount;
    order.bills.tax = newTax;
    order.bills.totalWithTax = newTotalWithTax;

    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Discounts updated successfully",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    }).populate("table");

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("table").populate("employee");

    res.status(200).json({ data: orders });
  } catch (error) {
    next(error);
  }
};

const getOrdersCount = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments(); // counts all documents in the collection

    res.status(200).json({ success: true, total: totalOrders });
  } catch (error) {
    next(error);
  }
};

const getTotalOrders = async (req, res, next) => {
  try {
    // Get only needed fields
    const orders = await Order.find({})
      .select("bills.totalWithTax orderStatus")
      .lean();

    // ✅ Overall total (all orders, regardless of status)
    const overallTotal = orders.reduce((sum, order) => {
      return sum + (order.bills?.totalWithTax || 0);
    }, 0);

    // ✅ Total for Paid orders
    const paidTotal = orders
      .filter((order) => order.orderStatus === "Paid")
      .reduce((sum, order) => sum + (order.bills?.totalWithTax || 0), 0);

    // ✅ Total for Not Paid orders
    const unpaidTotal = overallTotal - paidTotal;

    res.status(200).json({
      success: true,
      data: {
        overallTotal: overallTotal.toFixed(2),
        paidTotal: paidTotal.toFixed(2),
        unpaidTotal: unpaidTotal.toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCustomersCount = async (req, res, next) => {
  try {
    const customers = await Order.aggregate([
      {
        $group: {
          _id: { $toLower: "$customerDetails.name" }, // group by lowercase name
        },
      },
      {
        $count: "uniqueCustomers", // count distinct names
      },
    ]);

    const totalCustomers =
      customers.length > 0 ? customers[0].uniqueCustomers : 0;

    res.status(200).json({ success: true, total: totalCustomers });
  } catch (error) {
    next(error);
  }
};

const getOrdersByEmployee = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res
        .status(400)
        .json({ success: false, error: "Employee ID is required" });
    }

    // Count all-time orders
    const totalOrders = await Order.countDocuments({ employee: employeeId });

    // Calculate today's range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Count today's orders
    const todayOrders = await Order.countDocuments({
      employee: employeeId,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    res.status(200).json({
      success: true,
      employeeId,
      totalOrders,
      todayOrders,
    });
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

    const todayOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    })
      .select("bills.totalWithTax")
      .lean();

    const startOfYesterday = new Date(startOfDay);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setDate(endOfYesterday.getDate() + 1);

    const yesterdayOrders = await Order.find({
      createdAt: { $gte: startOfYesterday, $lt: endOfYesterday },
    })
      .select("bills.totalWithTax")
      .lean();

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
        yesterdayTotal: formattedYesterdayTotal,
      },
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
      data: deletedOrder,
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

module.exports = {
  addOrder,
  getOrderById,
  getOrders,
  updateOrder,
  getTotalOrders,
  getTotalOrdersToday,
  deleteOrder,
  getOrdersCount,
  getCustomersCount,
  getOrdersByEmployee,
  getAllOrders,
  updateOrderItems,
  updateOrderDiscount,
};
