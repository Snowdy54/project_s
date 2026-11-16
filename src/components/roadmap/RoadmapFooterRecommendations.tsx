import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoadmapFooterRecommendations: React.FC = () => {
  const recommendations = [
    {
      id: 'fullstack',
      title: 'Fullstack-разработчик',
      desc: 'Освойте серверную разработку на Node.js/PostgreSQL и проектируйте приложения под ключ.',
      link: '/roadmap/fullstack',
    },
    {
      id: 'architecture',
      title: 'Архитектура веб-систем',
      desc: 'Микрофронтенды, CI/CD, отказоустойчивость и высоконагруженные интерфейсы.',
      link: '/roadmap/architecture',
    },
    {
      id: 'mobile',
      title: 'React Native & Mobile',
      desc: 'Перенесите навыки React на создание мобильных приложений для iOS и Android.',
      link: '/roadmap/mobile',
    },
  ];

  return (
    <div className="w-full bg-[#0A1622] border border-[#203345] rounded-[32px] p-8 lg:p-10 space-y-6">
      <div className="flex items-center gap-3 text-white">
        <Compass className="w-6 h-6 text-[#FFF886]" />
        <div>
          <h3 className="text-xl font-bold">Логическое продолжение обучения</h3>
          <p className="text-sm text-gray-400">
            После освоения целевого трека вы можете продолжить развиваться в смежных направлениях:
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="bg-[#0F1E2C] border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-[#99C3FD]/40 transition group"
          >
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-white group-hover:text-[#FFF886] transition">
                {item.title}
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="pt-4">
              <Link
                to={item.link}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#99C3FD] group-hover:text-white transition"
              >
                <span>Перейти к карте</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};