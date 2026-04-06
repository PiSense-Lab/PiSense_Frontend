import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Data from "./pages/Data";
import Settings from "./pages/Settings";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/signin"
          element={token ? <Navigate to="/" /> : <Signin setToken={setToken} />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/" /> : <Signup setToken={setToken} />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            token ? <Layout setToken={setToken} /> : <Navigate to="/signin" />
          }
        >
          <Route index element={<Home />} />
          <Route path="data" element={<Data />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
