import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import Layout from "./Pages/Layout";
import NoPage from "./Pages/NoPage";
import GamePage from "./Pages/GamePage"; // Updated to GamePage
import Leaderboard from "./Pages/Leaderboard"; // Added Leaderboard
import Characters from "./Pages/Characters";
import Profile from "./Pages/Profile"; // Added Profile
import Login from "./Pages/Login";
import Register from "./Pages/Register";

//main application function
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* Wrap the game page with ProtectedRoute */}
          <Route path="game/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="profile/me" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="characters" element={<Characters />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />; // Redirect to login if no token
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
