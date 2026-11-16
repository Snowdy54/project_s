import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  let currentPath = '/';
  try {
    const location = useLocation();
    currentPath = location.pathname;
  } catch {
    currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  }

  const isHomeActive = currentPath === '/';
  const isRoadmapsActive = currentPath === '/roadmaps';
  const isMyLearningActive =
    currentPath === '/roadmap' ||
    currentPath === '/my-learning' ||
    currentPath.startsWith('/projects');

  return (
    <header className="w-full px-6 lg:px-[90px] pt-6 pb-4 flex items-center justify-between select-none">
      <Link
        to="/"
        className="font-pixel text-2xl lg:text-[28px] text-[#FDFCEA] tracking-wide hover:opacity-90 transition"
      >
        SkillMap
      </Link>

      {/* Без заднего фона и внешней рамки — как в Figma */}
      <nav className="flex items-center gap-3 bg-transparent">
        <Link
          to="/"
          className={`h-11 px-7 rounded-full flex items-center text-[15px] font-medium transition ${
            isHomeActive
              ? 'bg-[#DDD2FD] text-[#05101A] font-bold shadow-sm'
              : 'text-[#FDFCEA] hover:text-white/80'
          }`}
        >
          Главная
        </Link>

        <Link
          to="/roadmaps"
          className={`h-11 px-7 rounded-full flex items-center text-[15px] font-medium transition ${
            isRoadmapsActive
              ? 'bg-[#DDD2FD] text-[#05101A] font-bold shadow-sm'
              : 'text-[#FDFCEA] hover:text-white/80'
          }`}
        >
          Roadmaps
        </Link>

        <Link
          to="/roadmap"
          className={`h-11 px-7 rounded-full flex items-center text-[15px] font-medium transition ${
            isMyLearningActive
              ? 'bg-[#DDD2FD] text-[#05101A] font-bold shadow-sm'
              : 'text-[#FDFCEA] hover:text-white/80'
          }`}
        >
          Мое обучение
        </Link>
      </nav>

      <div className="w-11 h-11 rounded-full border border-[#DDD2FD]/40 bg-transparent flex items-center justify-center text-[#FDFCEA] hover:border-[#DDD2FD] transition cursor-pointer">
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