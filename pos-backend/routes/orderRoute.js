/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const express = require("express");
const {
  addOrder,
  getOrders,
  getOrderById,
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
} = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

router.route("/").post(addOrder);
router.put("/:orderId/items", updateOrderItems);
router.put("/:id/discount", updateOrderDiscount);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/all").get(isVerifiedUser, getAllOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);
// Get Total
router.route("/get/totalOrder").get(getTotalOrders);
router.route("/get/totalOrderToday").get(getTotalOrdersToday);
router.route("/get/getOrdersCount").get(getOrdersCount);
router.route("/get/getCustomerCount").get(getCustomersCount);
router.route("/get/orders/:employeeId").get(getOrdersByEmployee);

// Delete Order
router.route("/:id").delete(deleteOrder);

module.exports = router;
