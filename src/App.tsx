import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/Home';
import { RoadmapPage } from './pages/Roadmap';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/Projects/ProjectDetail';
import { ProfilePage } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: '#05131C' }} className="min-h-screen text-white">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmaps" element={<RoadmapPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/roadmap" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;