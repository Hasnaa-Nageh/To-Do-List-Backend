const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongoose connected successfully");
  } catch (err) {
    console.log(`MongoDB Connection Error: ${err}`);
  }
};

module.exports = connectDB;
