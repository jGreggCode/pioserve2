const createHttpError = require("http-errors");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const register = async (req, res, next) => {
  try {
    const { name, username, phone, email, password, role } = req.body;

    if (!name || !phone || !username || !email || !password || !role) {
      const error = createHttpError(400, "All fields are required!");
      return next(error);
    }

    const isUserPresent = await User.findOne({ email });
    if (isUserPresent) {
      const error = createHttpError(400, "User already exist!");
      return next(error);
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      const error = createHttpError(400, "Username already exist!");
      return next(error);
    }

    const user = { name, username, phone, email, password, role };
    const newUser = User(user);
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "New user created!", data: newUser });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = createHttpError(400, "All fields are required!");
      return next(error);
    }

    // Try finding user by email OR username
    const isUserPresent = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });

    if (!isUserPresent) {
      const error = createHttpError(401, "Invalid Credentials");
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, isUserPresent.password);
    if (!isMatch) {
      const error = createHttpError(401, "Invalid Credentials");
      return next(error);
    }

    const accessToken = jwt.sign(
      { _id: isUserPresent._id },
      config.accessTokenSecret,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax", // better for local dev
      secure: false,   // must stay false on HTTP
    });

    res
      .status(200)
      .json({
        success: true,
        message: "User login successfully!",
        data: isUserPresent,
      });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    // Use the find() method on the User model to get all documents (users).
    // You can add a filter here if you need to, but find() without
    // arguments returns all documents.
    const users = await User.find();

    // Send a 200 OK status with a JSON response containing the users data.
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    // If an error occurs, pass it to the error handling middleware.
    next(error);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res
      .status(200)
      .json({ success: true, message: "User logout successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getUserData, logout, getUsers };
