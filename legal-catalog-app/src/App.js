import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModuleList from "./components/ModuleList";
import ModuleDetail from "./components/ModuleDetail";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ModuleList />} />
          <Route path="/module/:id" element={<ModuleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
