import mongoose from "mongoose";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config();
console.log("Environment Variables:", process.env); // Debugging line

const { DB_HOST, PORT = 3000 } = process.env;

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_HOST);
    console.log("Database connection successful");

    // Start the server after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (err) {
    console.error(`Error connecting to the database: ${err.message}`);
    process.exit(1);
  }
};

// Call the function to connect to the database
connectToDatabase();
