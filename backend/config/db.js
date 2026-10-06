const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      process.env.DATABASE_URL ||
      "mongodb://127.0.0.1:27017/code_reviewer_ai";
    
    // Mask credentials for clean logging if using Atlas URI
    const maskedUri = connUri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@");
    console.log(`Connecting to MongoDB at: ${maskedUri}`);

    const conn = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    });

    console.log(`MongoDB Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected.");
    });

    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("Please check your MONGODB_URI in backend/.env");
    process.exit(1);
  }
};

module.exports = connectDB;
