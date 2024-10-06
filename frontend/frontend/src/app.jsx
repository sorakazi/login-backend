import React, { useState } from "react";
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  const handleSignUp = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        userData
      );
      setUser(response.data);
      console.log("Sign Up Successful:", response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      console.error("Error during sign up:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        userData
      );
      setUser(response.data);
      console.log("Login Successful:", response.data);
    } catch (error) {
      setError(error.response ? error.response.data.message : error.message);
      console.error("Error during login:", error);
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
      console.log("Logout Successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
              <Navigate to="/" /> // Redirect to home if not logged in
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
