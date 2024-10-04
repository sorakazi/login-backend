import express from "express";
import logger from "morgan";
import cors from "cors";
import { router as usersRoute } from "./routes/api/usersRoute.js";

const app = express();

// Set up logger format based on environment
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// Middleware
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static("public"));

// API routes
app.use("/api/users", usersRoute);

// Handle 404 errors
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Global error handling middleware
app.use((err, _req, res, _next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export { app };
