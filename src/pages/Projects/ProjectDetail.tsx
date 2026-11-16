import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { backendProjectsData } from '../../data/projectsData';
import { RichContentRenderer } from '../../components/projects/RichContentRenderer';
import { PixelLeftArrow } from './index';
import { Footer } from '../../components/layout/Footer';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [hasError, setHasError] = useState(false);

  const project = backendProjectsData.find((p) => p.id === projectId);

  const difficultyStyles = project
    ? {
        beginner: {
          label: 'Начинающий',
          color: '#FFF886',
        },
        advanced: {
          label: 'Продвинутый',
          color: '#99C3FD',
        },
        deep: {
          label: 'Углубленный',
          color: '#FF7116',
        },
      }[project.difficulty]
    : null;

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#05101A] text-white flex flex-col justify-between">
      <main className="w-full px-6 lg:px-[90px] pt-4 pb-12 space-y-8">
        {/* Кнопка возврата на страницу проектов направления */}
        <div>
          <Link
            to="/projects"
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="inline-flex items-center gap-3 text-[15px] text-[#FDFCEA]/85 hover:text-[#FDFCEA] transition"
          >
            <PixelLeftArrow />
            <span>Назад к базе проектов и упражнений</span>
          </Link>
        </div>

        {/* Ошибочный сценарий */}
        {hasError || !project || !difficultyStyles ? (
          <div className="w-full py-16 px-6 rounded-[28px] border border-red-500/30 bg-red-950/20 text-center space-y-4">
            <p className="text-lg text-white">
              Не удалось загрузить страницу проекта. Проверьте соединение
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setHasError(false)}
                className="h-11 px-7 rounded-full bg-[#DDD2FD] text-black text-sm font-bold hover:bg-[#D1C3FC] transition cursor-pointer"
              >
                Повторить попытку
              </button>
              <Link
                to="/projects"
                className="h-11 px-7 rounded-full border border-white/20 text-white text-sm font-medium inline-flex items-center hover:bg-white/5 transition"
              >
                К списку проектов
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Шапка страницы проекта */}
            <header className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 pt-1 pb-2">
              <div className="flex justify-start">
                <span
                  style={{
                    borderColor: difficultyStyles.color,
                    color: difficultyStyles.color,
                  }}
                  className="border-2 rounded-full px-6 py-1.5 text-sm font-medium"
                >
                  {difficultyStyles.label}
                </span>
              </div>

              <div className="text-left md:text-center">
                <h1
                  style={{ fontFamily: 'UnifontExMono, monospace' }}
                  className="text-3xl lg:text-[42px] text-[#FDFCEA] leading-tight"
                >
                  {project.title}
                </h1>
              </div>

              <div className="flex md:justify-end">
                <span
                  style={{ color: difficultyStyles.color }}
                  className="text-[15px] font-medium"
                >
                  Время выполнения: {project.estimatedTime}
                </span>
              </div>
            </header>

            {/* Основная часть */}
            <section className="pt-2">
              <RichContentRenderer blocks={project.content} />
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};