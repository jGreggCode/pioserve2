/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const mongoose = require("mongoose");
const Dish = require("../models/dishModel");
const config = require("./config");

// For Migration
async function migrateDiscounts() {
  try {
    await mongoose.connect(config.databaseURI);
    console.log("Connected to MongoDB.");

    const result = await Dish.updateMany(
      { itemDiscount: { $exists: false } },
      { $set: { itemDiscount: 0 } }
    );

    console.log(
      `Migration complete! Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents.`
    );
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.databaseURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`❌ Database connection failed: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
