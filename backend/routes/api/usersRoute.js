import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
} from "../../controller/usersController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import {
  validateSignup,
  validateLogin,
} from "../../middlewares/validationMiddleware.js";

const router = express.Router();

/**
 * POST /signup
 * Route for user registration
 * @url http://localhost:5000/api/users/signup
 */
router.post(
  "/signup",
  validateSignup,
  ctrlWrapper(async (req, res, next) => {
    await signupUser(req, res, next);
    res.status(201).json({ message: "User registered successfully" });
  })
);

/**
 * POST /login
 * Route for user login
 * @url http://localhost:5000/api/users/login
 */
router.post(
  "/login",
  validateLogin,
  ctrlWrapper(async (req, res, next) => {
    const userData = await loginUser(req, res, next);

    if (!userData || !userData.token) {
      throw httpError(401, "Authentication failed. No token generated.");
    }

    res.status(200).json({
      message: "User logged in successfully",
      token: userData.token,
    });
  })
);

/**
 * GET /logout
 * Route for user logout (requires authentication)
 * @url http://localhost:5000/api/users/logout
 */
router.get(
  "/logout",
  authenticateToken,
  ctrlWrapper(async (req, res, next) => {
    await logoutUser(req, res, next);
    res.status(200).json({ message: "User logged out successfully" });
  })
);

/**
 * DELETE /delete/:id
 * Route for deleting a user by ID (requires authentication)
 * @url http://localhost:5000/api/users/delete/:id
 */
router.delete(
  "/delete/:id",
  authenticateToken,
  ctrlWrapper(async (req, res, next) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw httpError(400, "Invalid user ID");
    }

    await deleteUser(req, res, next);
    res.status(200).json({ message: "User deleted successfully" });
  })
);

export { router };
