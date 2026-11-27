import React from 'react';
import { Link } from 'react-router-dom';
import { MySkillKeysHero } from '../../components/home/MySkillKeysHero';
import { Footer } from '../../components/layout/Footer';

// Данные для 4 карточек-папок преимуществ
const folderCards = [
  {
    id: 1,
    title: 'Синхронизируй\nопыт',
    desc: 'Подключи GitHub, загрузи резюме или просто отметь пройденные курсы и учебные проекты',
    bg: 'bg-[#FF7116]',
    tabColor: '#D95B09',
    text: 'text-white',
    descText: 'text-white/95',
    waveStroke: 'rgba(255, 255, 255, 0.22)',
    marginTop: 'lg:mt-0',
  },
  {
    id: 2,
    title: 'Визуализируй\nкарту',
    desc: 'ИИ превратит твои hard и soft skills в интерактивное «дерево» или «созвездие» компетенций',
    bg: 'bg-[#DDD2FD]',
    tabColor: '#BFAFF8',
    text: 'text-black',
    descText: 'text-black/85',
    waveStroke: 'rgba(120, 80, 220, 0.18)',
    marginTop: 'lg:mt-10',
  },
  {
    id: 3,
    title: 'Диагностируй\nпробелы',
    desc: 'Система подсветит навыки, которые требуются для целевой должности, но ещё не прокачаны',
    bg: 'bg-[#99C3FD]',
    tabColor: '#76A8F5',
    text: 'text-black',
    descText: 'text-black/85',
    waveStroke: 'rgba(40, 90, 200, 0.18)',
    marginTop: 'lg:mt-0',
  },
  {
    id: 4,
    title: 'Персонализируй\nплан',
    desc: 'Получи подборку: какие курсы пройти, в какой проект вступить или какую стажировку выбрать',
    bg: 'bg-[#FFF886]',
    tabColor: '#E5DE62',
    text: 'text-black',
    descText: 'text-black/85',
    waveStroke: 'rgba(180, 160, 20, 0.22)',
    marginTop: 'lg:mt-10',
  },
];

// Данные для 4 карточек специальностей
const specialtyCards = [
  {
    id: 1,
    title: 'Data Scientist',
    desc: 'Извлекай знания из данных\nи строй ML-модели',
    icon: '/icons/data-scientist.png',
  },
  {
    id: 2,
    title: 'Frontend-разработчик',
    desc: 'Воплощай дизайн в код: быстро,\nкрасиво, функционально',
    icon: '/icons/frontend.png',
  },
  {
    id: 3,
    title: 'UX/UI-дизайнер',
    desc: 'Создавай цифровые продукты,\nкоторыми приятно пользоваться',
    icon: '/icons/ui-ux.png',
  },
  {
    id: 4,
    title: 'Product Manager',
    desc: 'Соединяй бизнес, пользователей\nи команду разработки',
    icon: '/icons/product-manager.png',
  },
];

export const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-[#05131C] text-white selection:bg-[#FFF886] selection:text-black">
      {/* Главный контейнер */}
      <main className="w-full px-6 lg:px-[90px] space-y-24 pt-8 pb-20">

        {/* 1. HERO СЕКЦИЯ */}
        <section className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="flex-1 max-w-[660px] space-y-7">
            <h1 className="font-pixel text-4xl sm:text-5xl lg:text-[58px] xl:text-[62px] leading-[1.2] text-[#FDFCEA]">
              От первого узла
              <br />
              до принятого оффера
            </h1>

            <p className="text-[#FDFCEA]/85 text-base md:text-[18px] leading-relaxed font-normal max-w-[560px]">
              Загрузи свои достижения — наш ИИ построит интерактивное дерево компетенций,
              найдёт пробелы и подберёт курсы под твой уровень.
            </p>

            <div className="pt-2">
              <Link
                to="/roadmap"
                className="inline-flex items-center group cursor-pointer"
              >
                <span className="bg-[#FF7116] text-[#FDFCEA] text-sm md:text-base font-medium h-[54px] px-9 rounded-full flex items-center shadow-[0_0_10px_#FF7116] group-hover:shadow-[0_0_18px_#FF7116] group-hover:brightness-105 transition-all duration-200">
                  Построить свою интерактивную карту
                </span>
                <span className="w-[54px] h-[54px] rounded-full bg-[#FF7116] text-[#FDFCEA] flex items-center justify-center shadow-[0_0_10px_#FF7116] group-hover:shadow-[0_0_18px_#FF7116] group-hover:brightness-105 transition-all duration-200 -ml-[1px]">
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 34 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="2" height="16" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.6066 21.9203)" fill="#FDFCEA"/>
                    <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 14.8492)" fill="#FDFCEA"/>
                    <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 17.6777)" fill="#FDFCEA"/>
                    <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 20.5061)" fill="#FDFCEA"/>
                    <rect x="19.0919" y="13.4351" width="2" height="2" transform="rotate(-135 19.0919 13.4351)" fill="#FDFCEA"/>
                    <rect x="20.5061" y="17.6777" width="8" height="2" transform="rotate(-135 20.5061 17.6777)" fill="#FDFCEA"/>
                    <rect x="20.5061" y="20.5061" width="12" height="2" transform="rotate(-135 20.5061 20.5061)" fill="#FDFCEA"/>
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Правая часть: композиция клавиш MY SKILL → */}
          <div className="flex items-center justify-center lg:justify-end shrink-0 py-2">
            <MySkillKeysHero />
          </div>
        </section>

        {/* 2. ЧЕТЫРЕ КАРТОЧКИ-ПАПКИ ПРЕИМУЩЕСТВ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start pt-4">
          {folderCards.map((card) => (
            <div key={card.id} className={`w-full relative ${card.marginTop} pt-[18px]`}>
              {/* Язычок папки сзади */}
              <svg
                className="absolute top-0 left-0 w-full h-[58px] pointer-events-none overflow-visible"
                viewBox="0 0 310 52"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 52 L 0 24 A 24 24 0 0 1 24 0 L 138 0 C 152 0, 160 14, 175 14 L 175 52 Z"
                  fill={card.tabColor}
                />
              </svg>

              {/* Тело папки */}
              <div
                className={`relative w-full aspect-[310/188] min-h-[255px] xl:min-h-[275px] rounded-[30px] xl:rounded-[34px] p-7 xl:p-8 flex flex-col justify-between overflow-hidden shadow-xl ${card.bg} ${card.text}`}
              >
                {/* Волновой узор */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 310 204"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M-20 60 C 40 10, 90 120, 160 50 C 230 -20, 270 140, 340 70"
                    stroke={card.waveStroke}
                    strokeWidth="28"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M-30 150 C 50 100, 110 210, 180 140 C 240 80, 280 200, 350 160"
                    stroke={card.waveStroke}
                    strokeWidth="24"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                <h3 className="font-extrabold text-2xl xl:text-[28px] leading-tight whitespace-pre-line relative z-10">
                  {card.title}
                </h3>

                <p className={`text-sm xl:text-[16px] leading-relaxed font-normal relative z-10 max-w-[340px] ${card.descText}`}>
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* 3. КАТАЛОГ СПЕЦИАЛЬНОСТЕЙ */}
        <section className="space-y-10 pt-8">
          <h2 className="font-pixel text-3xl md:text-4xl text-center tracking-tight">
            Найди свою специальность и построй карту развития
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialtyCards.map((card) => (
              <div
                key={card.id}
                className="bg-[#FDFCEA] text-black rounded-[40px] p-7 xl:p-8 flex flex-col items-center justify-between min-h-[460px] xl:min-h-[480px] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="h-[145px] w-full flex items-center justify-center pt-1">
                  <img
                    src={card.icon}
                    alt={card.title}
                    className="w-[135px] h-[135px] xl:w-[145px] xl:h-[145px] object-contain select-none [image-rendering:pixelated]"
                  />
                </div>

                <div className="space-y-3 text-center w-full px-1">
                  <h3 className="font-pixel text-[26px] xl:text-[28px] leading-snug text-black tracking-normal">
                    {card.title}
                  </h3>
                  <p className="text-black text-[17px] xl:text-[18px] leading-[1.3] font-medium whitespace-pre-line max-w-[310px] mx-auto opacity-90">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-3 w-full flex justify-center">
                  <Link
                    to="/roadmap"
                    className="inline-flex items-center group w-full max-w-[310px] h-[52px] xl:h-[54px] cursor-pointer"
                  >
                    <span className="flex-1 h-full bg-[#DDD2FD] group-hover:bg-[#D1C3FC] text-black text-[15px] xl:text-[16px] font-bold flex items-center justify-center px-4 rounded-full transition shadow-sm">
                      Построить карту
                    </span>
                    <span className="w-[52px] h-[52px] xl:w-[54px] xl:h-[54px] rounded-full bg-[#05131C] text-[#DDD2FD] flex items-center justify-center shrink-0 -ml-[1px] transition-transform group-hover:scale-105 shadow-sm">
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 34 34"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="2" height="16" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.6066 21.9203)" fill="#DDD2FD"/>
                        <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 14.8492)" fill="#DDD2FD"/>
                        <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 17.6777)" fill="#DDD2FD"/>
                        <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 20.5061)" fill="#DDD2FD"/>
                        <rect x="19.0919" y="13.4351" width="2" height="2" transform="rotate(-135 19.0919 13.4351)" fill="#DDD2FD"/>
                        <rect x="20.5061" y="17.6777" width="8" height="2" transform="rotate(-135 20.5061 17.6777)" fill="#DDD2FD"/>
                        <rect x="20.5061" y="20.5061" width="12" height="2" transform="rotate(-135 20.5061 20.5061)" fill="#DDD2FD"/>
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Стрелки перелистывания слайдера */}
          <div className="flex justify-between items-center px-1 pt-2">
            <button
              type="button"
              aria-label="Назад"
              className="w-[100px] h-[50px] rounded-[30px] bg-[#FDFCEA] text-black flex items-center justify-center hover:bg-white transition shadow-md group cursor-pointer"
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-[-135deg] group-hover:-translate-x-1 transition-transform"
              >
                <rect width="2" height="16" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.6066 21.9203)" fill="currentColor"/>
                <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 14.8492)" fill="currentColor"/>
                <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 17.6777)" fill="currentColor"/>
                <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 20.5061)" fill="currentColor"/>
                <rect x="19.0919" y="13.4351" width="2" height="2" transform="rotate(-135 19.0919 13.4351)" fill="currentColor"/>
                <rect x="20.5061" y="17.6777" width="8" height="2" transform="rotate(-135 20.5061 17.6777)" fill="currentColor"/>
                <rect x="20.5061" y="20.5061" width="12" height="2" transform="rotate(-135 20.5061 20.5061)" fill="currentColor"/>
              </svg>
            </button>

            <button
              type="button"
              aria-label="Вперед"
              className="w-[100px] h-[50px] rounded-[30px] bg-[#FDFCEA] text-black flex items-center justify-center hover:bg-white transition shadow-md group cursor-pointer"
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-[45deg] group-hover:translate-x-1 transition-transform"
              >
                <rect width="2" height="16" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.6066 21.9203)" fill="currentColor"/>
                <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 14.8492)" fill="currentColor"/>
                <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 17.6777)" fill="currentColor"/>
                <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 20.5061)" fill="currentColor"/>
                <rect x="19.0919" y="13.4351" width="2" height="2" transform="rotate(-135 19.0919 13.4351)" fill="currentColor"/>
                <rect x="20.5061" y="17.6777" width="8" height="2" transform="rotate(-135 20.5061 17.6777)" fill="currentColor"/>
                <rect x="20.5061" y="20.5061" width="12" height="2" transform="rotate(-135 20.5061 20.5061)" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </section>

        {/* 4. ПЛЕЙСХОЛДЕР ИНТЕРАКТИВНОЙ КАРТЫ */}
        <section className="py-4">
          <div className="border border-dashed border-white/20 rounded-[32px] bg-[#0A1622] p-16 text-center">
            <p className="text-gray-400 font-bold text-base md:text-lg">
              тут будет пример интерактивной карты с тремя кликабельными узлами
            </p>
          </div>
        </section>

        {/* 5. НИЖНИЙ ПРОМО-БАННЕР */}
        <section className="relative flex flex-col lg:flex-row items-stretch gap-6 h-auto lg:h-[530px] xl:h-[550px]">
          {/* Левая оранжевая карточка */}
          <div className="w-full lg:w-[460px] xl:w-[480px] shrink-0 bg-[#FF7116] text-white rounded-[36px] xl:rounded-[40px] p-8 lg:p-12 flex flex-col justify-between shadow-xl relative overflow-hidden z-10">
            {/* SVG 1: Верхняя линия карты */}
            <svg
              className="absolute top-0 left-0 pointer-events-none overflow-visible"
              width="378"
              height="153"
              viewBox="0 0 378 153"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-12.0262 62.0721C-2.06622 75.4763 34.0711 146.681 47.7338 142.498C61.3964 138.314 48.5958 48.2212 69.9494 36.9698C91.303 25.7184 153.935 81.8386 175.855 74.9893C197.776 68.14 185.99 -1.67859 201.471 -4.12606C216.952 -6.57352 241.065 64.0177 268.741 60.3045C296.418 56.5914 351.065 -11.9532 367.529 -26.4048"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#FDFCEA"
                strokeOpacity="0.2"
              />
            </svg>

            {/* SVG 2: Боковая правая линия карты */}
            <svg
              className="absolute top-[85px] right-0 pointer-events-none overflow-visible"
              width="107"
              height="138"
              viewBox="0 0 107 138"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M107.919 127.874C66.2159 100.374 12.9711 110.663 10.0741 92.9157C7.17718 75.1684 91.6114 23.8194 107.919 10.0002"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#FDFCEA"
                strokeOpacity="0.2"
              />
            </svg>

            {/* Текст внутри карточки */}
            <div className="space-y-5 relative z-10 pt-2">
              <h2 className="text-3xl lg:text-[38px] xl:text-[42px] font-extrabold leading-[1.18] tracking-tight">
                Твой трек развития,<br />кем бы ты ни был
              </h2>
              <p className="text-white/95 text-[16px] xl:text-[18px] leading-relaxed font-normal max-w-[360px]">
                Найди, чего не хватает до Middle, и изучай темы, востребованные на рынке труда
              </p>
            </div>

            {/* Кнопка «Подробнее ↗» */}
            <div className="pt-8 relative z-10">
              <Link
                to="/roadmap"
                className="inline-flex items-center justify-between bg-[#FDFCEA] text-black h-[56px] px-9 rounded-full hover:bg-white transition shadow-md group w-[230px]"
              >
                <span className="text-[17px] font-bold">Подробнее</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 34 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                >
                  <rect width="2" height="16" transform="matrix(0.707107 0.707107 0.707107 -0.707107 10.6066 21.9203)" fill="black"/>
                  <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 14.8492)" fill="black"/>
                  <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 17.6777)" fill="black"/>
                  <rect width="2" height="2" transform="matrix(0.707107 0.707107 0.707107 -0.707107 20.5061 20.5061)" fill="black"/>
                  <rect x="19.0919" y="13.4351" width="2" height="2" transform="rotate(-135 19.0919 13.4351)" fill="black"/>
                  <rect x="20.5061" y="17.6777" width="8" height="2" transform="rotate(-135 20.5061 17.6777)" fill="black"/>
                  <rect x="20.5061" y="20.5061" width="12" height="2" transform="rotate(-135 20.5061 20.5061)" fill="black"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Правая карточка: фото со строгим overflow-hidden */}
          <div className="flex-1 relative rounded-[36px] xl:rounded-[40px] overflow-hidden shadow-xl bg-[#16202A] min-h-[400px]">
            <img
              src="/banner-student.jpg"
              alt="Студент за работой"
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80';
              }}
            />

            {/* SVG 3: Левая верхняя линия изображения */}
            <svg
              className="absolute top-0 left-0 pointer-events-none overflow-visible z-20"
              width="351"
              height="146"
              viewBox="0 0 351 146"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-54.4999 93.1774C-28.1573 86.9639 -0.0424928 141.55 24.5855 134.527C49.2135 127.504 -2.23963 17.3053 23.1012 10.4137C48.442 3.52208 153.701 100.691 176.631 93.1774C199.56 85.6636 141.857 -25.1999 160.681 -34.6687C179.505 -44.1375 258.523 25.3573 288.5 18.5C318.477 11.6427 332.048 -57.1163 340.542 -75.8125"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#99C3FD"
              />
            </svg>

            {/* SVG 4: Правая нижняя линия изображения */}
            <svg
              className="absolute bottom-0 right-0 pointer-events-none overflow-visible z-20"
              width="364"
              height="181"
              viewBox="0 0 364 181"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0019 212.495C23.917 204.925 84.6058 239.685 97.113 234.841C109.62 229.996 103.216 207.209 103.91 184.897C104.732 158.486 110.541 105.132 131.063 104.013C154.147 102.755 207.054 143.48 227.642 136.944C248.229 130.408 262.501 66.1906 276.864 58.7031C291.227 51.2156 306.807 95.5804 321.314 88.1128C335.821 80.6451 363.785 21.9783 371.476 10.0012"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#FFF886"
              />
            </svg>
          </div>
        </section>

      </main>

      {/* 6. ФУТЕР */}
      <Footer />
    </div>
  );
};