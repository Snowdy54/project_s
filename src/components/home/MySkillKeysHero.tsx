import React from 'react';
import { Link } from 'react-router-dom';

// Высококонтрастный процедурный SVG-шум (замена растровой текстуры из Figma)
const NOISE_DATA_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='2.8' intercept='-0.9'/%3E%3CfeFuncG type='linear' slope='2.8' intercept='-0.9'/%3E%3CfeFuncB type='linear' slope='2.8' intercept='-0.9'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const KeyArrowIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M3.5 10H15.5M15.5 10L10.5 5M15.5 10L10.5 15"
      stroke="#FDFCEA"
      strokeWidth="3"
      strokeLinecap="square"
    />
  </svg>
);

interface KeycapProps {
  label?: string;
  isArrow?: boolean;
  rotateDeg: number;
}

const OrangeKeycap: React.FC<KeycapProps> = ({
  label,
  isArrow = false,
  rotateDeg,
}) => {
  return (
    <div
      style={{
        transform: `rotate(${rotateDeg}deg)`,
        background:
          'radial-gradient(circle at 50% 50%, #F9DDCB 0%, #FF964F 46%, #FF7116 100%)',
        boxShadow: '0 0 4px rgba(5, 19, 28, 0.5)',
      }}
      className="relative w-[68px] h-[68px] sm:w-[92px] sm:h-[92px] lg:w-[120px] lg:h-[120px] rounded-[16px] sm:rounded-[20px] lg:rounded-[25px] flex items-center justify-center transition-transform duration-200 hover:scale-[1.03] shrink-0"
    >
      {/* Внутренняя площадка клавиши (84x84 при 120x120 -> 70%) */}
      <div
        style={{
          background: 'linear-gradient(180deg, #F8B88C 0%, #FF7116 100%)',
        }}
        className="relative w-[70%] h-[70%] rounded-[11px] sm:rounded-[14px] lg:rounded-[17px] flex items-center justify-center"
      >
        {/* Внутренняя обводка 3px (линейный градиент #FFFFFF 35% -> 0%) */}
        <div
          style={{
            padding: '3px',
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          className="absolute inset-0 rounded-[11px] sm:rounded-[14px] lg:rounded-[17px] pointer-events-none"
        />

        {isArrow ? (
          <KeyArrowIcon />
        ) : (
          <span
            style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
            className="text-[18px] sm:text-[21px] lg:text-[24px] font-black leading-none text-[#FDFCEA]"
          >
            {label}
          </span>
        )}
      </div>

      {/* Слой текстурного шума (Hard light) */}
      <div
        style={{
          backgroundImage: NOISE_DATA_URI,
          backgroundSize: '96px 96px',
          opacity: 0.14,
          mixBlendMode: 'hard-light',
        }}
        className="absolute inset-0 rounded-[16px] sm:rounded-[20px] lg:rounded-[25px] pointer-events-none"
      />
    </div>
  );
};

export const MySkillKeysHero: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center select-none"
      aria-label="MY SKILL"
    >
      {/* Верхний ряд: M Y */}
      <div className="flex items-center justify-center -mb-1 lg:-mb-1.5">
        <OrangeKeycap label="M" rotateDeg={-2} />
        <div className="-ml-1 lg:-ml-1.5">
          <OrangeKeycap label="Y" rotateDeg={2.5} />
        </div>
      </div>

      {/* Средний ряд: S K I L L */}
      <div className="flex items-center justify-center">
        <OrangeKeycap label="S" rotateDeg={2} />
        <div className="-ml-1 lg:-ml-1.5">
          <OrangeKeycap label="K" rotateDeg={-2} />
        </div>
        <div className="-ml-1 lg:-ml-1.5">
          <OrangeKeycap label="I" rotateDeg={1.5} />
        </div>
        <div className="-ml-1 lg:-ml-1.5">
          <OrangeKeycap label="L" rotateDeg={-2} />
        </div>
        <div className="-ml-1 lg:-ml-1.5">
          <OrangeKeycap label="L" rotateDeg={2} />
        </div>
      </div>

      {/* Нижняя клавиша: → (переход к интерактивным картам) */}
      <div className="-mt-1 lg:-mt-1.5">
        <Link to="/roadmap" title="Перейти к интерактивным картам">
          <OrangeKeycap isArrow rotateDeg={-2} />
        </Link>
      </div>
    </div>
  );
};