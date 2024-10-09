// server.js

import express from "express"; // Import express
import mongoose from "mongoose"; // Import mongoose
import dotenv from "dotenv"; // Import dotenv for environment variables
import cors from "cors"; // Import cors for cross-origin requests
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import jwt from "jsonwebtoken"; // Import jsonwebtoken for token generation

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an instance of express
const PORT = process.env.PORT || 3000; // Set the port

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // Swagger OpenAPI version
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my application",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL of your API
      },
    ],
  },
  apis: ["./server.js"], // Specify files with API documentation
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Basic routes
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logs in a user
 *     description: Use this route to authenticate a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  // Here, you would typically validate the user credentials
  // For demonstration, we'll use hardcoded credentials
  if (username === "user" && password === "pass") {
    // Generate a token
    const token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: "1h", // Token expiration time
    });
    return res.status(200).json({ token }); // Send token back
  }

  return res.status(401).json({ message: "Invalid credentials" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
