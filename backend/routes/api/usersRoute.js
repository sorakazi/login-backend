import express from "express";
import { ctrlWrapper } from "../../helpers/ctrlWrapper.js";
import {
  signupUser,
  loginUser,
  logoutUser,
} from "../../controller/usersController.js";
import { authenticateToken } from "../../backend/middlewares/authenticateToken.js";
import { httpError } from "../../helpers/httpError.js";
import {
  signupValidation,
  loginValidation,
} from "../../backend/validations/validation.js"; // Import validations

const router = express.Router();

/* POST: // http://localhost:3000/api/users/signup
{
  "email": "example@example.com",
  "password": "examplepassword"
}~
*/
router.post("/signup", async (req, res, next) => {
  const { error } = signupValidation.validate(req.body);
  if (error) {
    return next(httpError(400, error.details[0].message));
  }
  return ctrlWrapper(signupUser)(req, res, next);
});

/* POST: // http://localhost:3000/api/users/login
{
  "email": "example@example.com",app.use
  "password": "examplepassword"
}
*/
router.post("/login", async (req, res, next) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    return next(httpError(400, error.details[0].message));
  }
  return ctrlWrapper(loginUser)(req, res, next);
});

/* GET: // http://localhost:3000/api/users/logout */
router.get("/logout", authenticateToken, ctrlWrapper(logoutUser));

export { router };
