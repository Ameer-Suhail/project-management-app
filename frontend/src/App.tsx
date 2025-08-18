import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProjectPage from './components/ProjectPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <nav className="container mx-auto px-6 py-3">
            <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          </nav>
        </header>
        <main className="container mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:projectId" element={<ProjectPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
