const mongoose = require("mongoose");

const URI = process.env.DATABASE_URI ?? "mongodb://127.0.0.1:27017/authapi";
// connect to mongoDB
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // Default value is FALSE
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    // process.exit(1);
  }
};

// mongoose connection error handler
mongoose.connection
  .once("open", () => {
    console.log(`Mongoose connected ✅ DB - ${mongoose.connection.name}`);
  })
  .on("error", (error) => {
    console.log(`🔴 Error in Mongoose connection DB: ${error}`);
  })
  .on("disconnected", () => {
    console.log("🔴 Mongoose disconnected from DB");
  });

module.exports = connectDB;
