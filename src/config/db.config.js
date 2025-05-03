const mongoose = require("mongoose");

const connectDb = async () => {
  return await mongoose.connect(process.env.MONGODB_URL);
};

module.exports = connectDb;
