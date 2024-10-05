import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Load environment variables

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import {
  signupValidation,
  loginValidation,
} from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";
import { v4 as uuid4 } from "uuid";

// Load environment variables
const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
  throw httpError(500, "Secret key is missing in environment variables");
}

// Signup endpoint
const signupUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate the signup data
    const { error } = signupValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    // Check for email conflict
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw httpError(409, "Email already in use");
    }

    // Hash the user's password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a verification token
    const verificationToken = uuid4();

    // Create a new user
    const newUser = await User.create({
      email,
      password: hashPassword,
      verificationToken,
    });

    // Send the success response
    res.status(201).json({
      user: {
        email: newUser.email,
        verificationToken,
      },
    });
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

// Login endpoint
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate the login data
    const { error } = loginValidation.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw httpError(401, "Email or password is incorrect");
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw httpError(401, "Email or password is incorrect");
    }

    // Generate a JWT token
    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    // Update the user's token in the database
    await User.findByIdAndUpdate(user._id, { token });

    // Send the success response
    res.status(200).json({
      token,
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

// Logout endpoint
const logoutUser = async (req, res, next) => {
  try {
    const { id } = req.user; // Assuming the user ID is stored in req.user

    // Update the user's token in the database to null
    await User.findByIdAndUpdate(id, { token: null });

    // Send the success response
    res.status(204).send(); // No content
  } catch (error) {
    next(error); // Pass error to next middleware
  }
};

export { signupUser, loginUser, logoutUser }; // Ensure logoutUser is exported
