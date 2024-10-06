import Joi from "joi";

// Validation for signup
const signupValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{6,16}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Missing required password field",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.min": "Password must be at least {#limit} characters long",
      "string.max": "Password cannot be longer than {#limit} characters",
    }),
});

// Validation for login
const loginValidation = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "any.required": "Missing required email field",
      "string.email": "Invalid email format",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{6,16}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Missing required password field",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.min": "Password must be at least {#limit} characters long",
      "string.max": "Password cannot be longer than {#limit} characters",
    }),
});

// Export the validation schemas
export { signupValidation, loginValidation };
