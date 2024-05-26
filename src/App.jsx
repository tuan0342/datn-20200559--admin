import { useState } from "react";
import { Layout } from "antd";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./contexts/AuthContext";
import StoryManagement from "./pages/story/StoryManagement";
import Home from "./pages/home/Home";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard>
                <Home />
              </Dashboard>
            ) : (
              // <Login />
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/truyen/tao-chuyen"
          element={
            isAuthenticated ? (
              <Dashboard>
                <div>Create Management</div>
              </Dashboard>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/truyen/quan-ly"
          element={
            isAuthenticated ? (
              <Dashboard>
                <StoryManagement />
              </Dashboard>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
