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
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Signup a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 */
router.post(
  "/signup",
  validateSignup,
  ctrlWrapper(async (req, res) => {
    await signupUser(req, res);
    res.status(201).json({ message: "User registered successfully" });
  })
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       404:
 *         description: User not found
 */
router.post(
  "/login",
  validateLogin,
  ctrlWrapper(async (req, res) => {
    const userData = await loginUser(req, res);

    if (!userData || !userData.token) {
      throw new httpError(401, "Authentication failed. No token generated.");
    }

    res.status(200).json({
      message: "User logged in successfully",
      token: userData.token,
    });
  })
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out
 */
router.get(
  "/logout",
  authenticateToken,
  ctrlWrapper(async (req, res) => {
    await logoutUser(req, res);
    res.status(200).json({ message: "User logged out successfully" });
  })
);

/**
 * @swagger
 * /auth/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Auth]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 */
router.delete(
  "/delete/:id",
  authenticateToken,
  ctrlWrapper(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new httpError(400, "Invalid user ID");
    }

    await deleteUser(req, res);
    res.status(200).json({ message: "User deleted successfully" });
  })
);

export default router;
