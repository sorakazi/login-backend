import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
} from "../controller/usersController.js";
import { validateSignup, validateLogin } from "./validationMiddleware.js";
import { authenticateToken } from "./authenticateToken.js";
import errorHandler from "./errorHandler.js"; // Import your error handler

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Define routes
app.post("/signup", validateSignup, signupUser);
app.post("/login", validateLogin, loginUser);
app.post("/logout", authenticateToken, logoutUser);
app.delete("/user/:id", authenticateToken, deleteUser);

// Use the error handler after all routes
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
