import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { backendProjectsData } from '../../data/projectsData';
import { RichContentRenderer } from '../../components/projects/RichContentRenderer';
import { PixelRightArrow } from '../../components/projects/ProjectCard';
import { PixelLeftArrow } from './index';
import { Footer } from '../../components/layout/Footer';

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [hasError, setHasError] = useState(false);
  const [isAtGuide, setIsAtGuide] = useState(false);

  const project = backendProjectsData.find((p) => p.id === projectId);

  useEffect(() => {
    const handleScroll = () => {
      const guideEl = document.getElementById('step-by-step-guide');
      if (!guideEl) return;
      const rect = guideEl.getBoundingClientRect();
      setIsAtGuide(rect.top <= window.innerHeight * 0.8);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projectId]);

  const difficultyStyles = project
    ? {
        beginner: {
          label: 'Начинающий',
          color: '#FFF886',
          btnText: '#05131C',
          glowRgba: 'rgba(255, 248, 134, 0.9)',
        },
        advanced: {
          label: 'Продвинутый',
          color: '#99C3FD',
          btnText: '#05131C',
          glowRgba: 'rgba(153, 195, 253, 0.9)',
        },
        deep: {
          label: 'Углубленный',
          color: '#FF7116',
          btnText: '#05131C',
          glowRgba: 'rgba(255, 113, 22, 0.9)',
        },
      }[project.difficulty]
    : null;

  const handleStartProject = () => {
    const guideEl = document.getElementById('step-by-step-guide');
    if (guideEl) {
      guideEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#05131C] text-[#FFFFFF] flex flex-col justify-between relative">
      {/* Анимация мигания подсветки без изменения размера кнопки */}
      <style>{`
        @keyframes skillmapCtaBlink {
          0%, 100% {
            box-shadow: 0 0 0px 0px transparent;
            filter: brightness(0.95);
          }
          50% {
            box-shadow: 0 0 24px 4px var(--cta-glow);
            filter: brightness(1.06);
          }
        }
        .float-cta-blink {
          animation: skillmapCtaBlink 1.6s ease-in-out infinite;
        }
        .float-cta-blink:hover {
          animation: none;
          box-shadow: 0 0 24px 4px var(--cta-glow);
          filter: brightness(1.06);
        }
      `}</style>

      <main className="w-full px-6 lg:px-[90px] pt-4 pb-16 space-y-8">
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
            <p className="text-lg text-[#FFFFFF]">
              Не удалось загрузить страницу проекта. Проверьте соединение
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setHasError(false)}
                className="h-11 px-7 rounded-full bg-[#DDD2FD] text-[#05131C] text-sm font-bold hover:bg-[#D1C3FC] transition cursor-pointer"
              >
                Повторить попытку
              </button>
              <Link
                to="/projects"
                className="h-11 px-7 rounded-full border border-[#DDD2FD] text-[#FFFFFF] text-sm font-medium inline-flex items-center hover:bg-white/5 transition"
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
                  className="text-3xl lg:text-[42px] text-[#FFFFFF] leading-tight"
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

            {/* Основная часть: форматированное описание и блоки кода */}
            <section className="pt-2">
              <RichContentRenderer blocks={project.content} />
            </section>
          </>
        )}
      </main>

      {/* Плавающая кнопка: видна и мигает, пока пользователь не дошёл до пошагового гайда */}
      {project && difficultyStyles && !hasError && (
        <button
          type="button"
          onClick={handleStartProject}
          aria-hidden={isAtGuide}
          tabIndex={isAtGuide ? -1 : 0}
          style={
            {
              backgroundColor: difficultyStyles.color,
              color: difficultyStyles.btnText,
              '--cta-glow': difficultyStyles.glowRgba,
            } as React.CSSProperties
          }
          className={`${
            isAtGuide
              ? 'opacity-0 translate-y-3 pointer-events-none'
              : 'opacity-100 translate-y-0 float-cta-blink cursor-pointer'
          } fixed bottom-8 right-6 lg:right-[90px] z-50 h-[52px] px-7 rounded-full font-semibold text-[15px] inline-flex items-center gap-3 transition-all duration-300 select-none`}
        >
          <span>Приступить к выполнению</span>
          <PixelRightArrow />
        </button>
      )}

      <Footer />
    </div>
  );
};