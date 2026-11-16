import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/Home';
// 1. Импортируем наш рабочий компонент графа
import { RoadmapPage } from './pages/Roadmap'; 

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<div className="p-10 text-center text-gray-400">Вкладка «О нас»</div>} />
        
        {/* 2. Подключаем компонент вместо текстовой заглушки */}
        <Route path="/roadmap" element={<RoadmapPage />} /> 
        
        <Route path="/profile" element={<div className="p-10 text-center text-gray-400">Вкладка «Личный кабинет»</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;