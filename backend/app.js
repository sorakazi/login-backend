import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import { router as usersRoute } from "./routes/api/usersRoute.js";

// Load environment variables from .env file
dotenv.config();

// Check for required environment variables
const requiredEnvVars = ["DB_HOST", "SECRET_KEY", "FRONTEND_URL", "PORT"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`${varName} is missing in the environment variables`);
  }
});

// Debugging output
console.log("Environment Variables Loaded:");
console.log("PORT:", process.env.PORT);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("SECRET_KEY:", process.env.SECRET_KEY);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

const app = express();

// Middleware
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static("public"));

// API routes
app.use("/api/users", usersRoute);

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
