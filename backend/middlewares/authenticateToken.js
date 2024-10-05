import jwt from "jsonwebtoken";
import { User } from "../../backend/models/users.js";
import { httpError } from "../helpers/httpError.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

const authenticateToken = async (req, res, next) => {
  try {
    // Extract the authorization header
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    // Ensure Bearer token format
    if (bearer !== "Bearer" || !token) {
      throw httpError(401, "Not authorized: Invalid or missing token format");
    }

    // Verify the token
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    // Ensure the user exists and token matches
    if (!user || user.token !== token) {
      throw httpError(401, "Not authorized: Invalid or expired token");
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (error) {
    // Handle different JWT error types
    if (error.name === "JsonWebTokenError") {
      return next(httpError(401, "Not authorized: Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(httpError(401, "Not authorized: Token expired"));
    }
    next(httpError(401, "Not authorized"));
  }
};

export { authenticateToken };
