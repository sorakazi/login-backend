const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "API documentation for your application",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  tags: [
    {
      name: "Auth",
      description: "Authorization endpoints",
    },
    {
      name: "User",
      description: "User endpoints",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "User registration",
        requestBody: {
          description: "Registration's object",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/RegistrationRequest",
              },
            },
          },
        },
        responses: {
          201: {
            description: "Created",
            content: {},
          },
          400: {
            description: "Bad request (invalid request body)",
            content: {},
          },
          409: {
            description: "Provided email already exists",
            content: {},
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "User authentication",
        requestBody: {
          description: "Authentication's object",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/LoginRequest",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful operation",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginResponse",
                },
              },
            },
          },
          400: {
            description: "Bad request (invalid request body)",
            content: {},
          },
          403: {
            description: "Email doesn't exist / Password is wrong",
            content: {},
          },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        security: [{ Bearer: [] }],
        responses: {
          204: {
            description: "Successful operation",
          },
          400: {
            description: "No token provided",
            content: {},
          },
          401: {
            description: "Unauthorized (invalid access token)",
            content: {},
          },
          404: {
            description: "Invalid user / Invalid session",
            content: {},
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Use swagger-ui-express to serve the documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = specs; // Make sure to export the specs
