const mongoose = require("mongoose");
const Dbcon = async () => {
  try {
    // console.log("ENV VALUE:", process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = Dbcon;
