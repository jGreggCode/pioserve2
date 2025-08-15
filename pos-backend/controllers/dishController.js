const Dish = require("../models/dishModel");
const createHttpError = require("http-errors");

const addDish = async (req, res, next) => {
  try {
    const { name, price, category, subcategory } = req.body;
    if (!name || !price || !category || !subcategory) {
      const error = createHttpError(400, "Fields cannot be empty!");
      return next(error);
    }
    const isDishPresent = await Dish.findOne({ name });

    if (isDishPresent) {
      const error = createHttpError(400, "Dish already exist!");
      return next(error);
    }

    const newDish = new Dish({ name, price, category, subcategory });
    await newDish.save();
    res
      .status(201)
      .json({ success: true, message: "Dish added!", data: newDish });
  } catch (error) {
    next(error);
  }
};

module.exports = { addDish };
