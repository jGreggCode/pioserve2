const express = require("express");
const {
  addDish,
  getDishes,
  getAllDishes,
  deleteDish,
  getCategories,
  editDish,
} = require("../controllers/dishController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.route("/").post(isVerifiedUser, addDish);
router.route("/").get(getDishes);
router.route("/:dishId").put(editDish);
router.route("/all").get(getAllDishes);
router.route("/:id").delete(deleteDish);
router.route("/categories").get(getCategories);

module.exports = router;
