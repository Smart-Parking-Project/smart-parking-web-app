import React, { useContext } from "react";
import { AuthContext } from "../context/auth";

function Dashboard() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <h1>{user.username} you are now logged into Smart Parking Application</h1>
    </div>
  );
}

export default Dashboard;
