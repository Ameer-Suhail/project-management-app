import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProjectPage from './components/ProjectPage';
import ChangeOrganization from './components/ChangeOrganization';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();
  const orgKey = (location.state as any)?.orgSlug || (typeof window !== 'undefined' && window.localStorage.getItem('orgSlug')) || 'default-organization';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-3">
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
        </nav>
      </header>
      <main className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard key={orgKey} />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/change-organization" element={<ChangeOrganization />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
