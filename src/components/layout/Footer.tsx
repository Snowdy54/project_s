import React from 'react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full px-6 lg:px-[90px] pb-10 select-none">
      <div className="w-full bg-[#252D33] rounded-[36px] px-8 lg:px-14 py-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        {/* Левая часть: логотип и контакты с точными цветами */}
        <div className="space-y-2 text-center md:text-left">
          <span className="font-pixel text-2xl lg:text-[28px] text-[#FDFCEA] tracking-wide block">
            SkillMap
          </span>
          <p className="text-[#DDD2FD] text-sm font-normal">
            Напишите нам:{' '}
            <a
              href="mailto:roadmaps@skillmap.com"
              className="text-[#DDD2FD] hover:underline transition-colors decoration-[#DDD2FD]/50 underline-offset-4"
            >
              roadmaps@skillmap.com
            </a>
          </p>
        </div>

        {/* Правая часть: кнопка «Вверх ↑» с пиксельной стрелкой */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center group cursor-pointer"
          >
            <span className="bg-[#DDD2FD] group-hover:bg-[#D1C3FC] text-black text-sm font-bold h-[42px] px-6 rounded-full flex items-center justify-center transition shadow-sm">
              Вверх
            </span>
            <span className="w-[42px] h-[42px] rounded-full bg-[#05131C] flex items-center justify-center shrink-0 -ml-[1px] group-hover:-translate-y-0.5 transition-transform shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="8" height="2" transform="matrix(1 0 0 -1 8 21)" fill="#DDD2FD" />
                <rect width="2" height="6" transform="matrix(1 0 0 -1 8 19)" fill="#DDD2FD" />
                <rect width="5" height="2" transform="matrix(1 0 0 -1 3 13)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 3 11)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 5 9)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 7 7)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 9 5)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 11 3)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 13 5)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 15 7)" fill="#DDD2FD" />
                <rect width="2" height="2" transform="matrix(1 0 0 -1 17 9)" fill="#DDD2FD" />
                <rect width="2" height="4" transform="matrix(1 0 0 -1 19 13)" fill="#DDD2FD" />
                <rect width="3" height="2" transform="matrix(1 0 0 -1 16 13)" fill="#DDD2FD" />
                <rect width="2" height="6" transform="matrix(1 0 0 -1 14 19)" fill="#DDD2FD" />
              </svg>
            </span>
          </button>

          <span className="text-gray-400 text-xs font-normal">
            © 2026 SkillMap. Все права защищены.
          </span>
        </div>
      </div>
    </footer>
  );
};