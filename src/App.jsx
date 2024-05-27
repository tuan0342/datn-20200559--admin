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
import StoryRecycleBin from "./pages/story/StoryRecycleBin";
import StoryCreation from "./pages/story/StoryCreation";
import WeekAnalysis from "./pages/analysis/WeekAnalysis";
import MonthAnalysis from "./pages/analysis/MonthAnalysis";
import YearAnalysis from "./pages/analysis/YearAnalysis";

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
          path="/truyen/tao-truyen"
          element={
            isAuthenticated ? (
              <Dashboard>
                <StoryCreation />
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
        <Route
          path="/truyen/thung-rac"
          element={
            isAuthenticated ? (
              <Dashboard>
                <StoryRecycleBin />
              </Dashboard>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/thong-ke/tuan"
          element={
            isAuthenticated ? (
              <Dashboard>
                <WeekAnalysis />
              </Dashboard>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/thong-ke/thang"
          element={
            isAuthenticated ? (
              <Dashboard>
                <MonthAnalysis />
              </Dashboard>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/thong-ke/nam"
          element={
            isAuthenticated ? (
              <Dashboard>
                <YearAnalysis />
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
