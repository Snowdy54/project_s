import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { backendProjectsData } from '../../data/projectsData';
import type { ProjectDifficulty } from '../../types/project';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { Footer } from '../../components/layout/Footer';

// Сплошная пиксельная стрелка влево
export const PixelLeftArrow: React.FC<{ className?: string }> = ({
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
      d="M4 0H3V1H2V2H1V3H0V4H1V5H2V6H3V7H4V4H8V3H4V0Z"
      fill="currentColor"
    />
  </svg>
);

// Пиксельный крестик для активного фильтра
const PixelCloseIcon: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 7 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M0 0H1V1H0V0ZM6 0H7V1H6V0ZM1 1H2V2H1V1ZM5 1H6V2H5V1ZM2 2H3V3H2V2ZM4 2H5V3H4V2ZM3 3H4V4H3V3ZM2 4H3V5H2V4ZM4 4H5V5H4V4ZM1 5H2V6H1V5ZM5 5H6V6H5V5ZM0 6H1V7H0V6ZM6 6H7V7H6V6Z"
      fill="currentColor"
    />
  </svg>
);

export const ProjectsPage: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<ProjectDifficulty | null>(null);
  const [hasLoadError, setHasLoadError] = useState(false);

  const filterOptions: {
    id: ProjectDifficulty;
    label: string;
    activeBg: string;
    activeText: string;
  }[] = [
    {
      id: 'beginner',
      label: 'Начинающий',
      activeBg: '#FFF886',
      activeText: '#05101A',
    },
    {
      id: 'advanced',
      label: 'Продвинутый',
      activeBg: '#99C3FD',
      activeText: '#05101A',
    },
    {
      id: 'deep',
      label: 'Углубленный',
      activeBg: '#FF7116',
      activeText: '#FDFCEA',
    },
  ];

  const handleToggleDifficulty = (diff: ProjectDifficulty) => {
    setSelectedDifficulty((prev) => (prev === diff ? null : diff));
  };

  const handleClearFilter = () => {
    setSelectedDifficulty(null);
  };

  const filteredProjects = selectedDifficulty
    ? backendProjectsData.filter((p) => p.difficulty === selectedDifficulty)
    : backendProjectsData;

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#05101A] text-white flex flex-col justify-between">
      <main className="w-full px-6 lg:px-[90px] pt-4 pb-10 space-y-8">
        {/* Кнопка возврата на карту направления */}
        <div>
          <Link
            to="/roadmap"
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="inline-flex items-center gap-3 text-[15px] text-[#FDFCEA]/85 hover:text-[#FDFCEA] transition"
          >
            <PixelLeftArrow />
            <span>Назад к карте направления</span>
          </Link>
        </div>

        {/* Заголовок страницы */}
        <div className="text-center pt-1 pb-2">
          <h1
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="text-3xl sm:text-4xl lg:text-[42px] text-[#FDFCEA] tracking-wide leading-tight"
          >
            База проектов и упражнений: Backend-разработчик
          </h1>
        </div>

        {/* Панель фильтрации по сложности */}
        <div className="flex flex-wrap items-center gap-3.5 select-none">
          <span className="text-[16px] font-medium text-[#FDFCEA] mr-1">
            Сложность:
          </span>

          {filterOptions.map((option) => {
            const isSelected = selectedDifficulty === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleToggleDifficulty(option.id)}
                style={{
                  backgroundColor: isSelected ? option.activeBg : '#FDFCEA',
                  color: isSelected ? option.activeText : '#05101A',
                }}
                className="h-11 px-7 rounded-full text-[16px] font-semibold inline-flex items-center gap-3 transition-all duration-150 hover:opacity-95 cursor-pointer shadow-sm"
              >
                <span>{option.label}</span>
                {isSelected && <PixelCloseIcon />}
              </button>
            );
          })}

          {selectedDifficulty !== null && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="h-11 px-6 rounded-full border border-[#DDD2FD]/50 text-[#DDD2FD] hover:bg-[#DDD2FD]/10 text-sm font-medium transition cursor-pointer ml-1"
            >
              Очистить
            </button>
          )}
        </div>

        {/* Сценарий ошибки загрузки */}
        {hasLoadError ? (
          <div className="w-full py-16 px-6 rounded-[28px] border border-red-500/30 bg-red-950/20 text-center space-y-4">
            <p className="text-lg text-white">
              Не удалось загрузить список проектов. Проверьте соединение
            </p>
            <button
              type="button"
              onClick={() => setHasLoadError(false)}
              className="h-11 px-7 rounded-full bg-[#DDD2FD] text-black text-sm font-bold hover:bg-[#D1C3FC] transition cursor-pointer"
            >
              Повторить попытку
            </button>
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Сценарий пустого списка */
          <div className="w-full py-16 px-6 rounded-[28px] border border-white/10 text-center">
            <p className="text-lg text-[#FDFCEA]/80">
              По данному направлению ещё нет проектов. Загляните позже!
            </p>
          </div>
        ) : (
          /* Сетка карточек проектов на всю рабочую ширину как на главной */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-[30px] pt-2">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};