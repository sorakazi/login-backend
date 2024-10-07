import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // Load user from localStorage
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (userData) => {
    setLoading(true);
    setError("");
    try {
      console.log("Sending sign-up data:", userData);

      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        userData
      );

      setUser(response.data);
      console.log("Sign-up successful, user data:", response.data);
    } catch (error) {
      console.error("Sign-up failed, error details:", error.response);
      const errorMessage = error.response?.data.message || "Sign-up failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);
    setError("");
    try {
      console.log("Sending login data:", userData);

      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        userData
      );

      setUser(response.data);
      console.log("Login successful, user data:", response.data);
    } catch (error) {
      console.error("Login failed, error details:", error.response);
      const errorMessage = error.response?.data.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!user?.token) {
      console.error("No token found, cannot log out.");
      return;
    }

    try {
      await axios.get("http://localhost:5000/api/users/logout", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setUser(null);
      localStorage.removeItem("user"); // Clear user from localStorage
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Save user to localStorage
    } else {
      localStorage.removeItem("user"); // Clear user from localStorage
    }
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <SignUp onSignUp={handleSignUp} loading={loading} error={error} />
          }
        />
        <Route
          path="/login"
          element={
            <Login onLogin={handleLogin} loading={loading} error={error} />
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
