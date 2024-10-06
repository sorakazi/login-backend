import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
} from "../../controller/usersController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { httpError } from "../../helpers/httpError.js";
import {
  validateSignup,
  validateLogin,
} from "../../middlewares/validationMiddleware.js"; // New middleware

const router = express.Router();

/**
 * POST /signup
 * Route for user registration
 * @url http://localhost:5000/api/users/signup
 * @body { email: "example@example.com", password: "examplepassword" }
 */
router.post("/signup", validateSignup, async (req, res, next) => {
  console.log("Signup request received:", req.body);
  try {
    await ctrlWrapper(signupUser)(req, res, next);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error); // Log error
    next(error);
  }
});

/**
 * POST /login
 * Route for user login
 * @url http://localhost:5000/api/users/login
 * @body { email: "example@example.com", password: "examplepassword" }
 */
router.post("/login", validateLogin, async (req, res, next) => {
  console.log("Login request received:", req.body);
  try {
    const userData = await ctrlWrapper(loginUser)(req, res, next);

    // Check if userData is defined and contains a token
    if (!userData || !userData.token) {
      throw httpError(401, "Authentication failed. No token generated.");
    }

    res
      .status(200)
      .json({ message: "User logged in successfully", token: userData.token });
  } catch (error) {
    console.error("Login error:", error); // Log error
    next(error);
  }
});

/**
 * GET /logout
 * Route for user logout (requires authentication)
 * @url http://localhost:5000/api/users/logout
 * @header Authorization: Bearer <token>
 */
router.get("/logout", authenticateToken, async (req, res, next) => {
  try {
    await ctrlWrapper(logoutUser)(req, res, next);
    res.status(200).json({ message: "User logged out successfully" }); // Optional success response
  } catch (error) {
    console.error("Logout error:", error); // Log error
    next(error);
  }
});

/**
 * DELETE /delete/:id
 * Route for deleting a user by ID (requires authentication)
 * @url http://localhost:5000/api/users/delete/:id
 * @header Authorization: Bearer <token>
 */
router.delete("/delete/:id", authenticateToken, async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!ObjectId.isValid(id)) {
      return next(httpError(400, "Invalid user ID"));
    }
    await ctrlWrapper(deleteUser)(req, res, next);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error); // Log error
    next(error);
  }
});

export { router };
