/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const express = require("express");
const {
  register,
  login,
  getUserData,
  logout,
  getUsers,
  changePasswordWithOld,
  changeUserPassword,
  getUserDataById,
} = require("../controllers/userController");
const { isVerifiedUser } = require("../middlewares/tokenVerification");
const router = express.Router();

// Authentication Routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(isVerifiedUser, logout);
router.route("/getUser/:id").get(getUserDataById);
router.route("/").get(isVerifiedUser, getUserData);
router.route("/users").get(isVerifiedUser, getUsers);

// Admin
router
  .route("/update/admin-password")
  .put(isVerifiedUser, changePasswordWithOld);
router.route("/update/password").put(isVerifiedUser, changeUserPassword);

module.exports = router;
