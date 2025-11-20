import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ModuleList from "./components/ModuleList";
import ModuleDetail from "./components/ModuleDetail";
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-root">
        <header className="app-header">
          <h1>Catálogo Jurídico — Curso Examen de Grado</h1>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<ModuleList />} />
            <Route path="/module/:id" element={<ModuleDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
