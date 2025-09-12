import { useState } from "react";
import "./assets/css/style.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Register from "./components/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AuthProvider from "./components/AuthProvider";
import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import CoinPage from "./components/dashboard/CoinPage";
import ChatBot from "./components/dashboard/ChatBot"; // ✅ import ChatBot
import Favorites from "./components/dashboard/Favorites";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Main />} />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route path="/coin/:id" element={<CoinPage />} />
            <Route path="/favorites" element={<Favorites />} />

            {/* ✅ ChatBot Route */}
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <ChatBot />
                </PrivateRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
