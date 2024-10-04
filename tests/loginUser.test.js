import request from "supertest";
import { app } from "../app.js";
import { User } from "../models/usersModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

describe("Test @POST /api/users/login", () => {
  const signInData = {
    email: "edmun@example.com",
    password: "examplepassword",
  };

  const mockUserId = "mockUserId";
  const mockUser = {
    _id: mockUserId,
    email: signInData.email,
    password: bcrypt.hashSync(signInData.password, 10),
  };

  beforeAll(() => {
    // Mock User.findOne
    jest.spyOn(User, "findOne").mockImplementation(({ email }) => {
      if (email === signInData.email) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    });

    // Mock bcrypt.compare
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation((password, hashedPassword) => {
        return Promise.resolve(
          password === signInData.password &&
            hashedPassword === mockUser.password
        );
      });

    // Mock jwt.sign
    jest.spyOn(jwt, "sign").mockImplementation(() => "mockJwtToken");

    // Mock User.findByIdAndUpdate
    jest.spyOn(User, "findByIdAndUpdate").mockImplementation((id, update) => {
      if (id === mockUserId) {
        return Promise.resolve({ ...mockUser, ...update });
      }
      return Promise.resolve(null);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test("Test login with correct data.", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send(signInData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token", "mockJwtToken");

    const { user } = response.body;
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("subscription");
    expect(user.email).toEqual(expect.any(String));
    expect(user.subscription).toEqual(expect.any(String));
  });

  test("Test login with incorrect password.", async () => {
    jest
      .spyOn(bcrypt, "compare")
      .mockImplementationOnce(() => Promise.resolve(false));

    const response = await request(app)
      .post("/api/users/login")
      .send({ ...signInData, password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });

  test("Test login with non-existent email.", async () => {
    jest
      .spyOn(User, "findOne")
      .mockImplementationOnce(() => Promise.resolve(null));

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "nonexistent@example.com", password: "examplepassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is wrong"
    );
  });

  test("Test login with missing email.", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ password: "examplepassword" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Test login with missing password.", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "marvin@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
});
