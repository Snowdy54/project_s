import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-88px)] bg-[#05131C] text-[#FFFFFF] flex flex-col justify-between">
      <main className="w-full px-6 lg:px-[90px] py-12 space-y-6">
        <h1
          style={{ fontFamily: 'UnifontExMono, monospace' }}
          className="text-3xl lg:text-[40px] text-[#FDFCEA] leading-tight"
        >
          О проекте SkillMap
        </h1>
        <p className="text-[16px] text-[#FDFCEA]/80 max-w-2xl leading-relaxed">
          Интерактивная карта компетенций для студентов и начинающих специалистов.
          Превращает разрозненные учебные материалы в наглядный маршрут развития.
        </p>
        <div className="pt-4">
          <Link
            to="/roadmap"
            className="inline-flex items-center h-11 px-7 rounded-full bg-[#DDD2FD] text-[#05131C] font-bold text-[15px] hover:bg-[#D1C3FC] transition shadow-sm"
          >
            Перейти к карте
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
