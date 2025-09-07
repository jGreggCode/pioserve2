const express = require("express");
const {
  addDish,
  getDishes
} = require("../controllers/dishController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.route("/").post(isVerifiedUser, addDish);
router.route("/").get(getDishes); 

module.exports = router;
