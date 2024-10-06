import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        if (!token) {
          navigate("/login");
          return;
        }

        await axios.get("http://localhost:3000/api/users/logout", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        localStorage.removeItem("token"); // Remove token from local storage
        navigate("/login"); // Redirect to login page
      } catch (err) {
        console.error("Error logging out", err);
        navigate("/login"); // Redirect to login page even on error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div>
      {loading ? (
        <p>Logging out...</p> // Show loading message
      ) : (
        <p>You have been logged out.</p> // Optional: Confirmation message
      )}
    </div>
  );
};

export default Logout;
