import jwt from "jsonwebtoken";
import { User } from "../../models/users.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";
const { SECRET_KEY } = process.env;

const authenticateToken = async (req, _res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  // Ensure Bearer token format
  if (bearer !== "Bearer" || !token) {
    return next(httpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    // Check if user exists and token is valid
    if (!user || user.token !== token) {
      return next(httpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    // Handle token verification failure
    return next(httpError(401, "Not authorized"));
  }
};

export { authenticateToken };
