const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const swaggerDocs = require("./swagger");
const swaggerJsdoc = require(swaggerDocs);
const swaggerUi = require("swagger-ui-express");
dotenv.config();

const app = express();
app.use(express.json());

// Swagger docs
swaggerDocs(app);

// Routes
app.use("/auth", authRoutes);

// MongoDB connection
mongoose
  .connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection failed:", error));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
