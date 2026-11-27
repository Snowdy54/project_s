import React from 'react';
import type { UserRoadmapProgress } from '../../types/profile';
import {
  PixelTrashIcon,
  PixelCardChevronRightIcon,
} from './ProfileIcons';

interface ActivityRoadmapCardProps {
  map: UserRoadmapProgress;
  variant: 'favorite' | 'started';
  onOpen: (path: string) => void;
  onRequestRemove?: (id: string) => void;
}

export const ActivityRoadmapCard: React.FC<ActivityRoadmapCardProps> = ({
  map,
  variant,
  onOpen,
  onRequestRemove,
}) => {
  const isCompleted = map.progress >= 100;
  const accentColor = isCompleted ? '#FF7116' : '#99C3FD';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(map.path)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(map.path);
        }
      }}
      style={{
        borderColor: accentColor,
      }}
      className={`w-full min-h-[98px] rounded-[20px] border bg-[#FDFCEA0D] px-6 sm:px-[40px] py-[20px] flex items-center justify-between gap-6 sm:gap-[57px] cursor-pointer transition-all duration-200 ${
        isCompleted
          ? 'hover:shadow-[0_0_12px_rgba(255,113,22,0.45)]'
          : 'hover:shadow-[0_0_12px_rgba(153,195,253,0.45)]'
      }`}
    >
      {/* Левая часть: название + процент + шкала прогресса */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <span
            style={{ fontFamily: 'Product Sans, sans-serif' }}
            className="text-[19px] sm:text-[22px] font-medium text-[#FDFCEA] leading-tight truncate"
          >
            {map.title}
          </span>
          <span
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="text-[16px] sm:text-[18px] text-[#FDFCEA] shrink-0"
          >
            {map.progress}%
          </span>
        </div>

        {/* Шкала прогресса (подложка #FDFCEA, заполнение #99C3FD или #FF7116) */}
        <div className="w-full h-[14px] rounded-full bg-[#FDFCEA] border border-[#FDFCEA] overflow-hidden">
          <div
            style={{
              width: `${Math.min(100, Math.max(0, map.progress))}%`,
              backgroundColor: accentColor,
            }}
            className="h-full rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Правая круглая кнопка 36x36: корзина для избранных или '>' для начатых */}
      {variant === 'favorite' ? (
        <button
          type="button"
          title="Удалить из избранного"
          onClick={(e) => {
            e.stopPropagation();
            onRequestRemove?.(map.id);
          }}
          style={{ backgroundColor: accentColor }}
          className="w-[36px] h-[36px] rounded-full border-2 border-[#FDFCEA] text-[#05131C] flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
        >
          <PixelTrashIcon />
        </button>
      ) : (
        <span
          style={{ backgroundColor: accentColor }}
          className="w-[36px] h-[36px] rounded-full border-2 border-[#FDFCEA] text-[#05131C] flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
        >
          <PixelCardChevronRightIcon />
        </span>
      )}
    </div>
  );
};
