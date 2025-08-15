const express = require("express");
const {
  addDish,
} = require("../controllers/dishController");
const router = express.Router();
const { isVerifiedUser } = require("../middlewares/tokenVerification");

router.route("/").post(isVerifiedUser, addDish);

module.exports = router;
