import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Studio from "./pages/Studio";
import History from "./pages/History";
import Profile from "./pages/Profile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Route Guard (redirects already logged-in users to /dashboard)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Root index redirector
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

function AppContent() {
  const [editorTheme, setEditorTheme] = useState("twilight");

  return (
    <Container maxW="container.xl" w="full" py="4" px={{ base: "3", md: "5" }}>
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      
      {/* Universal Responsive Navbar */}
      <Navbar editorTheme={editorTheme} setEditorTheme={setEditorTheme} />

      {/* Main Page Routing */}
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Authentication Pages */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Dashboard & Studio Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studio"
          element={
            <ProtectedRoute>
              <Studio editorTheme={editorTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/converter"
          element={
            <ProtectedRoute>
              <Studio editorTheme={editorTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/debugger"
          element={
            <ProtectedRoute>
              <Studio editorTheme={editorTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quality"
          element={
            <ProtectedRoute>
              <Studio editorTheme={editorTheme} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback Catch-All */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
