import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import UploadReceipt from "./pages/UploadReceipt";
import Analytics from "./pages/Analytics";
import AIInsights from "./pages/AIInsights";
import Layout from "./components/layout/Layout";
import VoiceExpensePage from "./pages/VoiceExpensePage";
import Profile from "./pages/Profile"

// Protected Route Component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="text-stone-400">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      
      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROTECTED APP ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        
        <Route index element={<Dashboard />} />
        <Route path="add" element={<AddExpense />} />
        <Route path="upload" element={<UploadReceipt />} />
        <Route path="analytics" element={<Analytics />} />
         <Route path="profile" element={<Profile />} />
         <Route path="/voice" element={<VoiceExpensePage />} />
        <Route path="ai" element={<AIInsights />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}