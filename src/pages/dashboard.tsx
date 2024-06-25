// pages/dashboard.js

import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard</p>
    </ProtectedRoute>
  );
};

export default Dashboard;
