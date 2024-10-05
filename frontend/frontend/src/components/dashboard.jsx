// src/components/Dashboard.jsx
import React from "react";

const Dashboard = ({ user, onLogout }) => {
  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
