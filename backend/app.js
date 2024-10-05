import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Load environment variables

import express from "express";
import logger from "morgan";
import cors from "cors";
import { router as usersRoute } from "./routes/api/usersRoute.js";

// Load environment variables from .env file
dotenv.config({ path: "./.env" });
console.log("Loaded SECRET_KEY:", process.env.SECRET_KEY);
console.log("Environment Variables Loaded:", process.env);

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is missing in the environment variables");
}

const app = express();

// Set up logger format based on environment (development vs. production)
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Middleware
app.use(logger(formatsLogger)); // Logging middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Serve static files from the public directory
app.use(express.static("public"));

// API routes
app.use("/api/users", usersRoute); // Users API route

// Handle 404 errors for undefined routes
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Global error handling middleware
app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export { app };
