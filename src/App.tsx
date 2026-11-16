import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import * as HomeModule from './pages/Home';
import { RoadmapPage } from './pages/Roadmap';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/Projects/ProjectDetail';

const HomeComponent =
  (HomeModule as any).HomePage ||
  (HomeModule as any).Home ||
  (HomeModule as any).default ||
  (() => <div className="p-8">Главная страница</div>);

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#05101A' }} className="min-h-screen text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmaps" element={<RoadmapPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="*" element={<Navigate to="/roadmap" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;