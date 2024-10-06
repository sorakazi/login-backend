// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );
      onLogin(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username" // Adding autocomplete attribute
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password" // Adding autocomplete attribute
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleBack}>
          Back
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
