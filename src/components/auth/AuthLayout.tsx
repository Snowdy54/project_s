import React from 'react';
import { MySkillKeysHero } from '../home/MySkillKeysHero';

const GLOW_CIRCLES: Array<{ top: string; left: string }> = [
  { top: '3%', left: '12%' },
  { top: '3%', left: '50%' },
  { top: '3%', left: '88%' },

  { top: '20%', left: '31%' },
  { top: '20%', left: '69%' },

  { top: '37%', left: '12%' },
  { top: '37%', left: '50%' },
  { top: '37%', left: '88%' },

  { top: '65%', left: '12%' },
  { top: '65%', left: '50%' },
  { top: '65%', left: '88%' },

  { top: '82%', left: '31%' },
  { top: '82%', left: '69%' },

  { top: '98%', left: '12%' },
  { top: '98%', left: '50%' },
  { top: '98%', left: '88%' },
];

interface AuthLayoutProps {
  children: React.ReactNode;
  rightSectionClassName?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  rightSectionClassName = 'py-10 lg:py-8',
}) => {
  return (
    <div
      style={{ fontFamily: 'Product Sans, sans-serif' }}
      className="min-h-[calc(100vh-88px)] bg-[#05131C] text-[#FDFCEA] flex flex-col lg:flex-row items-stretch pt-3 px-4 sm:px-6 lg:pl-[90px] lg:pr-[90px]"
    >
      {/* ЛЕВАЯ ЧАСТЬ: ПАНЕЛЬ С КРУГАМИ СО СВЕЧЕНИЕМ И КЛАВИШАМИ MY SKILL → */}
      <section className="hidden lg:flex lg:w-[52%] xl:w-[53%] shrink-0 rounded-t-[30px] border-t-2 border-l-2 border-r-2 border-b-0 border-[#FDFCEA] bg-[#05131C] relative overflow-hidden items-center justify-center p-8 select-none">
        {GLOW_CIRCLES.map((pos, idx) => (
          <span
            key={idx}
            style={{
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 24px 6px rgba(253, 252, 234, 0.28)',
            }}
            className="absolute w-[30px] h-[30px] xl:w-[34px] xl:h-[34px] rounded-full bg-[#05131C] pointer-events-none"
          />
        ))}

        <div className="relative z-10 scale-[0.82] xl:scale-[0.95] 2xl:scale-100">
          <MySkillKeysHero />
        </div>
      </section>

      {/* ПРАВАЯ ЧАСТЬ: ФОРМА АВТОРИЗАЦИИ */}
      <section className={`flex-1 flex items-center justify-center lg:pl-12 ${rightSectionClassName}`}>
        {children}
      </section>
    </div>
  );
};
