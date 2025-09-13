const express = require("express");
const {
  countDishes,
  countOrders,
  countTables,
  countUsers,
  getAllCounts,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.route("/counts").get(isVerifiedUser, getAllCounts);

// PUT /api/users/:id
router.route("/update/:id").put(isVerifiedUser, updateUser);
router.route("/delete/:id").delete(isVerifiedUser, deleteUser);

module.exports = router;
