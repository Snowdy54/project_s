import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<div className="p-10 text-center text-gray-400">Вкладка «О нас»</div>} />
        <Route path="/roadmap" element={<div className="p-10 text-center text-gray-400">Вкладка «Карта навыков»</div>} />
        <Route path="/profile" element={<div className="p-10 text-center text-gray-400">Вкладка «Личный кабинет»</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;