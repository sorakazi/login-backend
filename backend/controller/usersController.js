import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import { signupValidation } from "../validations/validation.js";
import { httpError } from "../helpers/httpError.js";
import { v4 as uuid4 } from "uuid";

const { SECRET_KEY } = process.env;

// Signup endpoint
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate the signup data
  const { error } = signupValidation.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }

  // Check for email conflict
  const user = await User.findOne({ email });
  if (user) {
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
};

// Login endpoint
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate the login data
  const { error } = signupValidation.validate(req.body);
  if (error) {
    throw httpError(401, error.message);
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
};

// Logout endpoint
const logoutUser = async (req, res) => {
  const { id } = req.user; // Assuming the user ID is stored in req.user

  // Update the user's token in the database to null
  await User.findByIdAndUpdate(id, { token: null });

  // Send the success response
  res.status(204).send(); // No content
};

export { signupUser, loginUser, logoutUser }; // Ensure logoutUser is exported
