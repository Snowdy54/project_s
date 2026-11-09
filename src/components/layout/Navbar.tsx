import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Строгое разделение активных страниц:
  const isHomeActive = currentPath === '/';
  const isRoadmapsActive = currentPath === '/roadmaps';
  // Вкладка «Мое обучение» активна только на странице персональной интерактивной карты
  const isMyLearningActive = currentPath === '/roadmap' || currentPath === '/my-learning';

  return (
    <header className="w-full px-6 lg:px-[90px] pt-6 pb-4 flex items-center justify-between select-none">
      {/* Логотип SkillMap */}
      <Link
        to="/"
        className="font-pixel text-2xl lg:text-[28px] text-[#FDFCEA] tracking-wide hover:opacity-90 transition"
      >
        SkillMap
      </Link>

      {/* Центральное навигационное меню */}
      <nav className="flex items-center gap-2 p-1.5 rounded-full border border-white/10 bg-[#05131C]">
        <Link
          to="/"
          className={`h-10 px-6 rounded-full flex items-center text-sm font-medium transition ${
            isHomeActive
              ? 'bg-[#DDD2FD] text-black font-bold shadow-sm'
              : 'text-white hover:text-white/80'
          }`}
        >
          Главная
        </Link>

        <Link
          to="/roadmaps"
          className={`h-10 px-6 rounded-full flex items-center text-sm font-medium transition ${
            isRoadmapsActive
              ? 'bg-[#DDD2FD] text-black font-bold shadow-sm'
              : 'text-white hover:text-white/80'
          }`}
        >
          Roadmaps
        </Link>

        <Link
          to="/roadmap"
          className={`h-10 px-6 rounded-full flex items-center text-sm font-medium transition ${
            isMyLearningActive
              ? 'bg-[#DDD2FD] text-black font-bold shadow-sm'
              : 'text-white hover:text-white/80'
          }`}
        >
          Мое обучение
        </Link>
      </nav>

      {/* Иконка профиля */}
      <div className="w-10 h-10 rounded-full border border-white/20 bg-[#0E1A26] flex items-center justify-center text-white hover:border-white/50 transition cursor-pointer">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </header>
  );
};