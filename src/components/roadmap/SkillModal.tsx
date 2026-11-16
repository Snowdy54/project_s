import React, { useEffect } from 'react';
import type { SkillNodeData, NodeStatus, SkillResource } from '../../types/roadmap';

interface SkillModalProps {
  node: SkillNodeData | null;
  onClose: () => void;
  onChangeStatus: (nodeId: string, status: NodeStatus) => void;
}

// Пиксельный крестик закрытия
const PixelModalClose: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 0H1V1H0V0ZM6 0H7V1H6V0ZM1 1H2V2H1V1ZM5 1H6V2H5V1ZM2 2H3V3H2V2ZM4 2H5V3H4V2ZM3 3H4V4H3V3ZM2 4H3V5H2V4ZM4 4H5V5H4V4ZM1 5H2V6H1V5ZM5 5H6V6H5V5ZM0 6H1V7H0V6ZM6 6H7V7H6V6Z"
      fill="currentColor"
    />
  </svg>
);

// Иконки типов ресурсов из макета Figma
const ResourceTypeIcon: React.FC<{ type: SkillResource['type'] }> = ({ type }) => {
  if (type === 'статья') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#05101A]">
        <rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M8 20H16M12 16V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'видео' || type === 'курс') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#05101A]">
        <rect x="3" y="6" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="2" />
        <path d="M16 10L21 7V17L16 14V10Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#05101A]">
      <path
        d="M3 5H10C11.1 5 12 5.9 12 7V19C12 17.9 11.1 17 10 17H3V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21 5H14C12.9 5 12 5.9 12 7V19C12 17.9 12.9 17 14 17H21V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M6 9H9M6 12H9M15 9H18M15 12H18" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
};

const blackFontStyle = { fontFamily: 'Product Sans Black, sans-serif' };

export const SkillModal: React.FC<SkillModalProps> = ({
  node,
  onClose,
  onChangeStatus,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const difficultyLabel = {
    beginner: 'Начинающий',
    advanced: 'Продвинутый',
    deep: 'Углубленный',
  }[node.difficulty];

  const whereUsedItems = node.whereUsed || [
    'При отладке сетевых ошибок и проблем с загрузкой ресурсов.',
    'При проектировании API и взаимодействии фронтенда с бэкендом.',
    'Как обязательная база для успешного прохождения технических собеседований.',
  ];

  const entryLevelText =
    node.entryLevel ||
    (node.isRoot
      ? 'Начинающий. Стартовая точка для любого web-разработчика.'
      : `${difficultyLabel}. Требуется понимание базовых тем предыдущего узла.`);

  const isCompletedOrSkipped = node.status === 'completed' || node.status === 'skipped';
  const isInProgress = node.status === 'in_progress';
  const isNotStarted = node.status === 'not_started';

  const getResourceSubtitle = (res: SkillResource) => {
    if (res.type === 'официальный сайт') return 'Официальный сайт';
    if (res.type === 'статья') return 'Статья';
    if (res.type === 'курс') return `Курс от ${res.sourceName}`;
    return `Видео · ${res.sourceName}`;
  };

  return (
    <>
      {/* Тонкий кастомный скроллбар без системных стрелок (только для области описания) */}
      <style>{`
        .skill-desc-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .skill-desc-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .skill-desc-scroll::-webkit-scrollbar-thumb {
          background: rgba(5, 16, 26, 0.22);
          border-radius: 9999px;
        }
        .skill-desc-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(5, 16, 26, 0.45);
        }
        @supports not selector(::-webkit-scrollbar) {
          .skill-desc-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(5, 16, 26, 0.25) transparent;
          }
        }
      `}</style>

      {/* Прозрачный оверлей для закрытия по клику вне карточки */}
      <div className="absolute inset-0 z-30" onClick={onClose} />

      {/* Карточка навыка по макету Figma */}
      <div
        className="absolute top-3 right-3 sm:top-4 sm:right-5 z-40 w-[calc(100%-24px)] sm:w-[530px] h-auto max-h-[calc(100%-32px)] bg-[#FDFCEA] text-[#05101A] rounded-[36px] px-8 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200 border border-black/10 select-text"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* 1. ФИКСИРОВАННАЯ ШАПКА КАРТОЧКИ */}
        <div className="relative text-center shrink-0 pb-3">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0.5 w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center transition cursor-pointer text-[#05101A]"
            title="Закрыть"
          >
            <PixelModalClose />
          </button>

          <h2
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="text-[30px] sm:text-[34px] font-bold leading-tight text-[#05101A] px-8"
          >
            {node.title}
          </h2>
          <p
            style={blackFontStyle}
            className="text-[16px] font-black text-[#05101A] mt-0.5"
          >
            Сложность: {difficultyLabel}
          </p>
        </div>

        {/* 2. ПРОКРУЧИВАЕМАЯ ОБЛАСТЬ ОПИСАНИЯ */}
        <div className="skill-desc-scroll flex-1 min-h-0 overflow-y-auto pr-3 space-y-3.5 py-1">
          {/* Суть навыка */}
          <div className="space-y-1">
            <h3 style={blackFontStyle} className="text-[16px] font-black text-[#05101A]">
              Суть навыка
            </h3>
            <p className="text-[14px] text-[#05101A] leading-[1.42]">
              {node.description}
            </p>
          </div>

          {/* Где применяется */}
          <div className="space-y-1">
            <h3 style={blackFontStyle} className="text-[16px] font-black text-[#05101A]">
              Где применяется
            </h3>
            <ul className="text-[14px] text-[#05101A] space-y-1 leading-[1.4]">
              {whereUsedItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Уровень входа */}
          <div className="space-y-1">
            <h3 style={blackFontStyle} className="text-[16px] font-black text-[#05101A]">
              Уровень входа
            </h3>
            <p className="text-[14px] text-[#05101A] leading-[1.42]">
              {entryLevelText}
            </p>
          </div>

          {/* Примеры задач */}
          <div className="space-y-1">
            <h3 style={blackFontStyle} className="text-[16px] font-black text-[#05101A]">
              Примеры задач:
            </h3>
            <ul className="text-[14px] text-[#05101A] space-y-1 leading-[1.4]">
              {node.prerequisites.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. ФИКСИРОВАННЫЕ РЕСУРСЫ И ТЕКУЩИЙ СТАТУС */}
        <div className="shrink-0 pt-3 mt-2 border-t border-black/20 space-y-3">
          {/* Ресурсы */}
          <div className="space-y-2">
            <h3
              style={blackFontStyle}
              className="text-[16px] font-black text-[#05101A] text-center"
            >
              Ресурсы:
            </h3>
            <div className="space-y-2">
              {node.resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-[16px] bg-[#FDFCEA] border border-[#05101A] hover:bg-black/[0.04] transition group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <ResourceTypeIcon type={res.type} />
                    <div className="min-w-0">
                      <div
                        style={blackFontStyle}
                        className="text-[13.5px] font-black text-[#05101A] group-hover:underline truncate"
                      >
                        {res.title}
                      </div>
                      <div className="text-[11.5px] text-[#05101A]/75 leading-tight mt-0.5">
                        {getResourceSubtitle(res)}
                      </div>
                    </div>
                  </div>

                  <span className="text-[12.5px] font-medium text-[#05101A] shrink-0">
                    {res.price}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <hr className="border-black/20" />

          {/* Текущий статус */}
          <div className="space-y-2">
            <h3
              style={blackFontStyle}
              className="text-[16px] font-black text-[#05101A] text-center"
            >
              Текущий статус
            </h3>

            <div
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="space-y-2"
            >
              {/* Верхний ряд: В изучении | Не изучено */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onChangeStatus(node.id, 'in_progress')}
                  className={`h-[40px] rounded-full text-[14.5px] font-medium border border-[#05101A] transition flex items-center justify-center px-3 cursor-pointer ${
                    isInProgress
                      ? 'bg-[#99C3FD] text-[#05101A]'
                      : 'bg-[#FDFCEA] text-[#05101A] hover:bg-[#99C3FD]/30'
                  }`}
                >
                  В изучении
                </button>

                <button
                  type="button"
                  onClick={() => onChangeStatus(node.id, 'not_started')}
                  className={`h-[40px] rounded-full text-[14.5px] font-medium border border-[#05101A] transition flex items-center justify-center px-3 cursor-pointer ${
                    isNotStarted
                      ? 'bg-[#05101A] text-[#FDFCEA]'
                      : 'bg-[#FDFCEA] text-[#05101A] hover:bg-black/10'
                  }`}
                >
                  Не изучено
                </button>
              </div>

              {/* Нижний ряд на всю ширину: Изучено / Пропущено */}
              <button
                type="button"
                onClick={() => onChangeStatus(node.id, 'completed')}
                className={`w-full h-[40px] rounded-full text-[14.5px] font-medium border border-[#05101A] transition flex items-center justify-center px-4 cursor-pointer ${
                  isCompletedOrSkipped
                    ? 'bg-[#FFF886] text-[#05101A]'
                    : 'bg-[#FDFCEA] text-[#05101A] hover:bg-[#FFF886]/40'
                }`}
              >
                Изучено / Пропущено
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};