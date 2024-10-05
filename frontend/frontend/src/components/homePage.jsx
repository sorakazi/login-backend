// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const homePage = () => {
  const navigate = useNavigate();

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>Welcome to My Auth App</h1>
      <p>Please choose an option:</p>
      <button onClick={handleSignUpRedirect}>Sign Up</button>
      <button onClick={handleLoginRedirect}>Login</button>
    </div>
  );
};

export default homePage;
