// middleware/validationMiddleware.js
import {
  signupValidation,
  loginValidation,
} from "../validations/validation.js"; // Ensure this path is correct

// Validation middleware for signup
export const validateSignup = (req, res, next) => {
  const { error } = signupValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next(); // Proceed to the next middleware/route handler if validation passes
};

// Validation middleware for login
export const validateLogin = (req, res, next) => {
  const { error } = loginValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next(); // Proceed to the next middleware/route handler if validation passes
};
