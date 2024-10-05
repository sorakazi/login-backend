import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../../controller/usersController.js";
import { authenticateToken } from "../../middlewares/authenticateToken.js";
import { httpError } from "../../helpers/httpError.js";
import {
  signupValidation,
  loginValidation,
} from "../../validations/validation.js";

const router = express.Router();

/**
 * POST /signup
 * Route for user registration
 * @url http://localhost:3000/api/users/signup
 * @body { email: "example@example.com", password: "examplepassword" }
 */
router.post("/signup", async (req, res, next) => {
  try {
    const { error } = signupValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.details[0].message);
    }
    await ctrlWrapper(signupUser)(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /login
 * Route for user login
 * @url http://localhost:3000/api/users/login
 * @body { email: "example@example.com", password: "examplepassword" }
 */
router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.details[0].message);
    }
    await ctrlWrapper(loginUser)(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /logout
 * Route for user logout (requires authentication)
 * @url http://localhost:3000/api/users/logout
 * @header Authorization: Bearer <token>
 */
router.get("/logout", authenticateToken, async (req, res, next) => {
  try {
    await ctrlWrapper(logoutUser)(req, res, next);
  } catch (error) {
    next(error);
  }
});

export { router };
