import React, { useState } from 'react';
import type { RoadmapDirectionInfo } from '../../types/roadmap';

interface RoadmapHeaderProps {
  directionInfo?: RoadmapDirectionInfo;
  progressPercent?: number;
  currentLevel?: string;
  isAuthorized?: boolean;
  onToggleAuth?: () => void;
  onExportPDF?: () => void;
}

export const RoadmapHeader: React.FC<RoadmapHeaderProps> = ({
  directionInfo,
  progressPercent = 48,
  currentLevel = 'Продвинутый',
  isAuthorized = true,
  onToggleAuth = () => {},
  onExportPDF = () => {},
}) => {
  const [openStates, setOpenStates] = useState({
    desc: false,
    ai: false,
    related: false,
  });

  const toggle = (key: 'desc' | 'ai' | 'related') => {
    setOpenStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const title = directionInfo?.title || 'Frontend-разработчик';

  const PixelArrow = ({ isOpen }: { isOpen: boolean }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-150 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
    >
      <path
        d="M13 16H11V14H13V16ZM11 14H9V12H11V14ZM15 14H13V12H15V14ZM9 12H7V10H9V12ZM17 12H15V10H17V12ZM7 10H5V8H7V10ZM19 10H17V8H19V10Z"
        fill="#FDFCEA"
      />
    </svg>
  );

  return (
    <div className="w-full space-y-4 select-none">
      {/* 1. Верхний ряд кнопок управления */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="h-10 px-6 rounded-full bg-[#DDD2FD] text-black text-[13px] font-medium tracking-[0.01em] hover:bg-[#D1C3FC] transition shadow-sm cursor-pointer"
          >
            Персонализация дерева (Gap analysis)
          </button>
          <button
            type="button"
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="h-10 px-6 rounded-full bg-[#DDD2FD] text-black text-[13px] font-medium tracking-[0.01em] hover:bg-[#D1C3FC] transition shadow-sm cursor-pointer"
          >
            База проектов и упражнений
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleAuth}
            className={`h-9 px-4 rounded-full text-xs font-semibold border transition cursor-pointer ${
              isAuthorized
                ? 'bg-emerald-950/70 text-emerald-400 border-emerald-700'
                : 'bg-amber-950/70 text-amber-300 border-amber-700'
            }`}
            title="Переключение авторизации"
          >
            {isAuthorized ? 'Авторизован' : 'Гость (без входа)'}
          </button>

          <button
            type="button"
            onClick={onExportPDF}
            className="h-10 px-6 rounded-full bg-[#FFF886] text-black text-sm font-bold flex items-center gap-2 hover:bg-[#F5EE7A] transition shadow-md cursor-pointer"
          >
            <span>Экспорт в PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Дешборд: растянут на всю ширину карты, метрики отцентрированы по макету */}
      <div className="w-full bg-[#FDFCEA] text-black rounded-[20px] px-8 py-4 shadow-lg flex items-center justify-center">
        {/* Центральный блок ровно по центру плашки */}
        <div className="w-[780px] max-w-full flex items-center divide-x-2 divide-black/20">
          
          {/* Колонка 1: Мой прогресс */}
          <div className="w-[320px] shrink-0 pr-6 flex flex-col justify-center space-y-1.5">
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[15px] font-medium leading-none text-black"
            >
              Мой прогресс
            </span>
            <div className="flex items-center gap-3">
              <div className="w-[180px] h-[16px] bg-[#05131C] rounded-full p-[2px] shadow-inner shrink-0">
                <div
                  className="h-full bg-[#FFF886] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span
                style={{ fontFamily: 'UnifontExMono, monospace' }}
                className="text-[15px] font-medium leading-none text-black"
              >
                {progressPercent}%
              </span>
            </div>
          </div>

          {/* Колонка 2: Уровень */}
          <div className="w-[190px] shrink-0 px-6 flex flex-col justify-center space-y-1.5">
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[15px] font-medium leading-none text-black"
            >
              Уровень
            </span>
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[15px] font-medium leading-none text-black truncate"
            >
              {currentLevel}
            </span>
          </div>

          {/* Колонка 3: Направление */}
          <div className="w-[270px] shrink-0 pl-6 flex flex-col justify-center space-y-1.5">
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[15px] font-medium leading-none text-black"
            >
              Направление
            </span>
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[15px] font-medium leading-none text-black truncate"
            >
              {title}
            </span>
          </div>

        </div>
      </div>

      {/* 3. Три аккордеона на ширину карты */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-2">
        {/* Аккордеон 1: Описание направления */}
        <div
          className={`bg-[#05131C] border-2 border-[#DDD2FD] overflow-hidden ${
            openStates.desc ? 'rounded-[32px]' : 'rounded-full'
          }`}
        >
          <button
            type="button"
            onClick={() => toggle('desc')}
            className={`w-full h-[54px] px-8 flex items-center justify-between cursor-pointer ${
              openStates.desc ? 'border-b border-[#DDD2FD]' : ''
            }`}
          >
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[14px] font-medium text-[#FDFCEA] tracking-[0.01em]"
            >
              Описание направления
            </span>
            <PixelArrow isOpen={openStates.desc} />
          </button>

          {openStates.desc && (
            <div className="p-7 text-white text-[14px] leading-relaxed space-y-4">
              <p>Создание интерфейсов, с которыми взаимодействует пользователь.</p>
              <div className="space-y-1.5">
                <p>
                  <span style={{ fontFamily: 'Product Sans Black, sans-serif' }} className="font-black">Навыки:</span> HTML, CSS, JS, React, Инструменты сборки.
                </p>
                <p>
                  <span style={{ fontFamily: 'Product Sans Black, sans-serif' }} className="font-black">Задачи:</span> Верстка макетов, реализация логики на клиенте, работа с API.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Аккордеон 2: Влияние ИИ на направление */}
        <div
          className={`bg-[#05131C] border-2 border-[#DDD2FD] overflow-hidden ${
            openStates.ai ? 'rounded-[32px]' : 'rounded-full'
          }`}
        >
          <button
            type="button"
            onClick={() => toggle('ai')}
            className={`w-full h-[54px] px-8 flex items-center justify-between cursor-pointer ${
              openStates.ai ? 'border-b border-[#DDD2FD]' : ''
            }`}
          >
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[14px] font-medium text-[#FDFCEA] tracking-[0.01em]"
            >
              Влияние ИИ на направление
            </span>
            <PixelArrow isOpen={openStates.ai} />
          </button>

          {openStates.ai && (
            <div className="p-7 text-white text-[14px] leading-relaxed">
              <p>
                ИИ ускоряет написание шаблонного кода и генерацию тестов, однако глубокое понимание архитектуры и UX остается критически важным для специалиста.
              </p>
            </div>
          )}
        </div>

        {/* Аккордеон 3: Связанные направления */}
        <div
          className={`bg-[#05131C] border-2 border-[#DDD2FD] overflow-hidden ${
            openStates.related ? 'rounded-[32px]' : 'rounded-full'
          }`}
        >
          <button
            type="button"
            onClick={() => toggle('related')}
            className={`w-full h-[54px] px-8 flex items-center justify-between cursor-pointer ${
              openStates.related ? 'border-b border-[#DDD2FD]' : ''
            }`}
          >
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-[14px] font-medium text-[#FDFCEA] tracking-[0.01em]"
            >
              Связанные направления
            </span>
            <PixelArrow isOpen={openStates.related} />
          </button>

          {openStates.related && (
            <div className="p-7 text-white text-[14px] leading-relaxed">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-white">•</span>
                  <span>UI/UX Дизайн</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">•</span>
                  <span>Backend Node.js</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};