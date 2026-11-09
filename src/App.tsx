import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import * as HomeModule from './pages/Home';
import { RoadmapPage } from './pages/Roadmap';

// Защита от различий в экспорте главной страницы (Home / HomePage / default)
const HomeComponent =
  (HomeModule as any).HomePage ||
  (HomeModule as any).Home ||
  (HomeModule as any).default ||
  (() => <div className="p-8">Главная страница</div>);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#071018] text-white">
        {/* Navbar внутри BrowserRouter — теперь useLocation() работает без ошибок */}
        <Navbar />

        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/roadmaps" element={<RoadmapPage />} />
          <Route path="*" element={<Navigate to="/roadmap" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;