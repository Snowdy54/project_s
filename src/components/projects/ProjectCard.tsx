import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProjectData } from '../../types/project';

interface ProjectCardProps {
  project: ProjectData;
}

// Сплошная пиксельная стрелка вправо из макета Figma
export const PixelRightArrow: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    width="16"
    height="14"
    viewBox="0 0 8 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 0H5V1H6V2H7V3H8V4H7V5H6V6H5V7H4V4H0V3H4V0Z"
      fill="currentColor"
    />
  </svg>
);

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const theme = {
    beginner: {
      label: 'Начинающий',
      borderColor: '#FFF886',
      glowColor: 'rgba(255, 248, 134, 0.45)',
      buttonGlow: 'group-hover/btn:shadow-[0_0_20px_rgba(255,248,134,0.75)]',
      accentBg: '#FFF886',
      badgeText: '#FFF886',
    },
    advanced: {
      label: 'Продвинутый',
      borderColor: '#99C3FD',
      glowColor: 'rgba(153, 195, 253, 0.45)',
      buttonGlow: 'group-hover/btn:shadow-[0_0_20px_rgba(153,195,253,0.75)]',
      accentBg: '#99C3FD',
      badgeText: '#99C3FD',
    },
    deep: {
      label: 'Углубленный',
      borderColor: '#FF7116',
      glowColor: 'rgba(255, 113, 22, 0.45)',
      buttonGlow: 'group-hover/btn:shadow-[0_0_20px_rgba(255,113,22,0.75)]',
      accentBg: '#FF7116',
      badgeText: '#FF7116',
    },
  }[project.difficulty];

  const handleOpenProject = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <article
      onClick={handleOpenProject}
      style={{
        borderColor: theme.borderColor,
        boxShadow: `0 0 10px 0 ${theme.glowColor}`,
      }}
      className="bg-[#05101A] border-2 rounded-[26px] p-7 lg:p-8 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 cursor-pointer select-none min-h-[360px]"
    >
      <div>
        {/* Метка сложности */}
        <span
          style={{
            borderColor: theme.borderColor,
            color: theme.badgeText,
          }}
          className="inline-block border-2 rounded-full px-5 py-1 text-sm font-medium"
        >
          {theme.label}
        </span>

        {/* Название проекта */}
        <h3 className="text-[#FDFCEA] font-bold text-2xl lg:text-[26px] leading-snug mt-6">
          {project.title}
        </h3>

        {/* Краткое описание */}
        <p className="text-[#FDFCEA] text-[15px] lg:text-[16px] leading-[1.45] mt-3">
          {project.shortDescription}
        </p>
      </div>

      <div className="pt-8 space-y-6">
        {/* Теги технологий в цвете #FDFCEA */}
        <div className="flex flex-wrap items-center gap-2 text-[15px] lg:text-[16px] text-[#FDFCEA]">
          {project.tags.map((tag, index) => (
            <React.Fragment key={tag}>
              <span>{tag}</span>
              {index < project.tags.length - 1 && <span>·</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Кнопка «Приступить →» */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenProject();
          }}
          style={{ backgroundColor: theme.accentBg }}
          className={`group/btn w-full h-[52px] rounded-full text-[#05101A] font-semibold text-[16px] px-7 flex items-center justify-center relative transition-all duration-200 cursor-pointer ${theme.buttonGlow}`}
        >
          <span className="transition-transform duration-200 group-hover/btn:-translate-x-[72px]">
            Приступить
          </span>
          <PixelRightArrow className="ml-3 transition-transform duration-200 group-hover/btn:translate-x-[88px]" />
        </button>
      </div>
    </article>
  );
};