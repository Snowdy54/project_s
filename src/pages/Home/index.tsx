import React from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-white pb-24 selection:bg-primary selection:text-white">
      <main className="max-w-[1360px] mx-auto px-6 pt-10 space-y-20">
        
        {/* --- HERO СЕКЦИЯ --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Левая колонка: Заголовок, плашки метрик и поисковая строка */}
          <div className="lg:col-span-7 space-y-10">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Постройте свой путь в IT через интерактивные карты
            </h1>

            {/* Метрики и поиск */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Плашка 80% */}
                <div className="bg-primary rounded-2xl px-6 py-4 w-36 shadow-lg shadow-primary/20">
                  <span className="text-2xl font-black block">80%</span>
                  <div className="w-full bg-black/25 h-1.5 rounded-full mt-2">
                    <div className="bg-white h-full w-4/5 rounded-full" />
                  </div>
                </div>

                {/* Плашка 73% */}
                <div className="bg-primary rounded-2xl px-6 py-4 w-36 shadow-lg shadow-primary/20">
                  <span className="text-2xl font-black block">73%</span>
                  <div className="w-full bg-black/25 h-1.5 rounded-full mt-2">
                    <div className="bg-white h-full w-[73%] rounded-full" />
                  </div>
                </div>

                {/* Строка поиска с голубой рамкой */}
                <div className="flex-1 min-w-[260px] relative">
                  <input
                    type="text"
                    placeholder="Найти курс, профессию или навык..."
                    className="w-full bg-transparent border-2 border-cyan rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan/50 transition"
                  />
                  <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка: Большой оранжевый медиа-блок */}
          <div className="lg:col-span-5">
            <div className="bg-primary rounded-3xl h-[340px] md:h-[380px] p-6 relative flex flex-col justify-between shadow-2xl shadow-primary/20">
              <div className="flex justify-end gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/40" />
              </div>
              <div className="text-white/90 text-sm font-medium">
                Индивидуальная карта развития компетенций
              </div>
            </div>
          </div>

        </section>

        {/* --- СЕКЦИЯ: ПОПУЛЯРНЫЕ КАРТЫ КОМПЕТЕНЦИЙ --- */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
              Популярные карты компетенций
            </h2>
          </div>

          {/* Сетка карточек цвета #1E2A32 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { id: 1, title: 'Frontend Developer', hasBadge: false },
              { id: 2, title: 'Backend (Go / Python)', hasBadge: true },
              { id: 3, title: 'Data Scientist', hasBadge: false },
              { id: 4, title: 'DevOps Engineer', hasBadge: true },
              { id: 5, title: 'UI/UX Designer', hasBadge: false },
            ].map((card) => (
              <div
                key={card.id}
                className="bg-card rounded-3xl p-5 h-80 flex flex-col justify-between border border-white/5 hover:border-cyan/40 transition-all duration-300 group cursor-pointer"
              >
                <div>
                  {card.hasBadge && (
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
                      Hot
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-gray-200 group-hover:text-cyan transition">
                  {card.title}
                </div>
              </div>
            ))}
          </div>

          {/* Стрелки перелистывания карусели */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <button
              aria-label="Назад"
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition shadow-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Вперед"
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition shadow-md shadow-primary/20"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* --- РАЗДЕЛИТЕЛЬНЫЙ БЛОК (КАК В МАКЕТЕ) --- */}
        <div className="h-44 bg-card/60 rounded-3xl border border-white/5" />

        {/* --- СЕКЦИЯ: ИНТЕРАКТИВНАЯ КАРТА ЗНАНИЙ --- */}
        <section className="space-y-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide">
            Интерактивная карта знаний
          </h2>

          {/* 4 карточки цвета #64DCEC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-cyan-card h-52 rounded-3xl p-6 text-background flex flex-col justify-end shadow-lg shadow-cyan/10 hover:brightness-105 transition cursor-pointer"
              >
                <span className="font-extrabold text-xl">Модуль {item}</span>
              </div>
            ))}
          </div>

          {/* Оранжевая кнопка действия внизу */}
          <div className="flex justify-center pt-2">
            <Link
              to="/roadmap"
              className="bg-primary hover:bg-primary-hover text-white text-base font-bold px-12 py-4 rounded-full transition shadow-xl shadow-primary/25"
            >
              Перейти к карте навыков
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
};