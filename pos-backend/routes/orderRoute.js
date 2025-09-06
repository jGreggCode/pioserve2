const express = require("express");
const { addOrder, getOrders, getOrderById, updateOrder, getTotalOrders, getTotalOrdersToday } = require("../controllers/orderController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();


router.route("/").post(isVerifiedUser, addOrder);
router.route("/").get(isVerifiedUser, getOrders);
router.route("/:id").get(isVerifiedUser, getOrderById);
router.route("/:id").put(isVerifiedUser, updateOrder);
// Get Total
router.route("/get/totalOrder").get(getTotalOrders);
router.route("/get/totalOrderToday").get(getTotalOrdersToday);

module.exports = router;