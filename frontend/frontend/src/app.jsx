import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Dashboard from "./components/dashboard";
import HomePage from "./components/homePage"; // Ensure this is uppercase
import Login from "./components/login"; // Ensure this is uppercase
import SignUp from "./components/signUp"; // Ensure this is uppercase

const App = () => {
  const [user, setUser] = useState(null);

  const handleSignUp = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/signup",
        userData
      );
      setUser(response.data); // Save user data to state
      console.log("Sign Up Successful:", response.data);
    } catch (error) {
      console.error(
        "Error during sign up:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleLogin = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        userData
      );
      setUser(response.data); // Save user data to state
      console.log("Login Successful:", response.data);
    } catch (error) {
      console.error(
        "Error during login:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/users/logout", {
        headers: {
          Authorization: `Bearer ${user.token}`, // Ensure you have a token to log out
        },
      });
      setUser(null); // Clear user data
      console.log("Logout Successful");
    } catch (error) {
      console.error(
        "Error during logout:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={handleLogout} />
            ) : (
              <HomePage />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
