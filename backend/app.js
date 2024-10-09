import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/api/usersRoute.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { setupSwagger } from "./swagger.js";
// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
setupSwagger(app);

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "SlimMON",
      version: "1.0.0",
      description: "API documentation for my application dsdsdsdds",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8081}`, // API URL
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust this path based on where your API documentation is
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Define routes
app.use("/auth", authRoutes);

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

// Start the server
const startServer = async () => {
  await connectToDatabase();

  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Initialize server
startServer();

// Export the app for testing or further use
export default app;
