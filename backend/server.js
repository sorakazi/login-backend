import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Load environment variables from .env file
dotenv.config();
const { DB_HOST, PORT = 3013 } = process.env;

// Validate required environment variables
if (!DB_HOST) {
  throw new Error("DB_HOST is missing in the environment variables");
}

// Function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");

    // Start the server after a successful database connection
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1);
  }
};

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my application",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // URL of your API
      },
    ],
  },
  apis: ["./server.js"], // Specify files with API documentation
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Graceful shutdown for database connection
const shutdown = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error closing database connection:", error.message);
    process.exit(1);
  }
};

// Connect to the database and start the server
connectToDatabase();

// Handle process termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
