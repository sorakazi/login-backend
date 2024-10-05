import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = () => {
  const navigate = useNavigate();

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
      }
    };

    handleLogout();
  }, [navigate]);

  return (
    <div>
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
