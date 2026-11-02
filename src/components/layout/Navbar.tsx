import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { label: 'Главная', path: '/' },
    { label: 'Roadmaps', path: '/roadmap' },
    { label: 'Мое обучение', path: '/profile' },
  ];

  return (
    <header className="w-full pt-5 pb-3">
      {/* Ровно 90px от краев экрана без лишнего max-w */}
      <div className="w-full px-6 lg:px-[90px] flex items-center justify-between h-[43px]">
        
        {/* Логотип: UnifontExMono в 1 пиксель, без размытия */}
        <Link to="/" className="font-pixel text-[32px] font-normal tracking-normal text-white select-none">
          SkillMap
        </Link>

        {/* 3 кнопки меню на шрифте Product Sans */}
        <nav className="flex items-center gap-3">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`h-[43px] px-7 rounded-full flex items-center justify-center text-[15px] font-normal transition-all duration-150 ${
                  isActive
                    ? 'bg-[#DDD2FD] text-black shadow-sm'
                    : 'bg-transparent text-white border-2 border-[#DDD2FD] hover:bg-[#DDD2FD]/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Аватар 41x41 px с иконкой цвета #FDFCEA */}
        <Link
          to="/profile"
          aria-label="Личный кабинет"
          className="w-[41px] h-[41px] rounded-full shrink-0 flex items-center justify-center transition hover:opacity-90"
        >
          <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20.5" cy="20.5" r="20.5" fill="#DDD2FD" />
            <circle cx="20.5" cy="20.5" r="14.5" fill="#071018" />
            {/* Голова #FDFCEA */}
            <circle cx="20.5" cy="17.5" r="3.8" fill="#FDFCEA" />
            {/* Силуэт тела #FDFCEA */}
            <path
              d="M14.5 26.5C14.5 23.5 17 22.5 20.5 22.5C24 22.5 26.5 23.5 26.5 26.5V27.5H14.5V26.5Z"
              fill="#FDFCEA"
            />
          </svg>
        </Link>

      </div>
    </header>
  );
};