import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = ({ onSignUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup", // Corrected URL
        formData
      );
      onSignUp(response.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Error signing up");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password.replace(/./g, "*")} // Mask password input with asterisks
          onChange={handleChange}
          required
          autoComplete="new-password"
          style={{ caretColor: "transparent" }} // Hide caret
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <button type="button" onClick={handleBack}>
          Back
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;
