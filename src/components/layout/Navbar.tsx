import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Точная векторная иконка fi-sr-user из макета Figma
const ProfileUserIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="12" cy="6" r="6" />
    <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,1,1H20a1,1,0,0,0,1-1A9.01,9.01,0,0,0,12,14Z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isHomeActive = currentPath === '/';
  const isMapsActive =
    currentPath === '/roadmap' ||
    currentPath === '/roadmaps' ||
    currentPath.startsWith('/projects');
  const isProfileActive = currentPath === '/profile';

  return (
    <header className="w-full px-6 lg:px-[90px] pt-6 pb-4 flex items-center justify-between select-none">
      <Link
        to="/"
        className="font-pixel text-2xl lg:text-[28px] text-[#FDFCEA] tracking-wide hover:opacity-90 transition"
      >
        SkillMap
      </Link>

      {/* Две кнопки навигации с обводкой #DDD2FD */}
      <nav className="flex items-center gap-4 bg-transparent">
        <Link
          to="/"
          className={`h-11 px-7 rounded-full border border-[#DDD2FD] flex items-center text-[15px] transition ${
            isHomeActive
              ? 'bg-[#DDD2FD] text-[#05131C] font-bold shadow-sm'
              : 'bg-transparent text-[#FFFFFF] font-medium hover:bg-[#DDD2FD]/15'
          }`}
        >
          Главная
        </Link>

        <Link
          to="/roadmap"
          className={`h-11 px-7 rounded-full border border-[#DDD2FD] flex items-center text-[15px] transition ${
            isMapsActive
              ? 'bg-[#DDD2FD] text-[#05131C] font-bold shadow-sm'
              : 'bg-transparent text-[#FFFFFF] font-medium hover:bg-[#DDD2FD]/15'
          }`}
        >
          Интерактивные карты
        </Link>
      </nav>

      {/* Иконка Личного кабинета: толстое кольцо #DDD2FD + силуэт #FDFCEA */}
      <Link
        to="/profile"
        title="Личный кабинет"
        className={`w-11 h-11 rounded-full border-[5px] border-[#DDD2FD] flex items-center justify-center text-[#FDFCEA] transition ${
          isProfileActive
            ? 'bg-[#DDD2FD]/25 shadow-[0_0_16px_rgba(221,210,253,0.45)]'
            : 'bg-transparent hover:bg-[#DDD2FD]/15'
        }`}
      >
        <ProfileUserIcon />
      </Link>
    </header>
  );
};