import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { NodeStatus } from '../../types/roadmap';

interface PreviewNode {
  id: string;
  title: string;
  category: string;
  description: string;
  status: NodeStatus;
}

const INITIAL_PREVIEW_NODES: PreviewNode[] = [
  {
    id: 'html',
    title: 'HTML5 & Семантика',
    category: 'верстка',
    description: 'Семантические теги, доступность и структура документа.',
    status: 'completed',
  },
  {
    id: 'js',
    title: 'JavaScript Основы',
    category: 'программирование',
    description: 'Типы данных, функции, DOM-события и асинхронность.',
    status: 'in_progress',
  },
  {
    id: 'react',
    title: 'React Основы',
    category: 'фреймворки',
    description: 'Компонентный подход, JSX, props и управление состоянием.',
    status: 'not_started',
  },
];

const NEXT_STATUS: Record<NodeStatus, NodeStatus> = {
  not_started: 'in_progress',
  in_progress: 'completed',
  completed: 'not_started',
  skipped: 'not_started',
};

const STATUS_LABELS: Record<NodeStatus, string> = {
  completed: 'Изучено',
  in_progress: 'В изучении',
  not_started: 'Не начато',
  skipped: 'Пропущено',
};

function getNodeVisuals(status: NodeStatus) {
  if (status === 'completed' || status === 'skipped') {
    return {
      fill: '#FDFCEA',
      border: '#FFF886',
      glow: 'rgba(255, 248, 134, 0.75)',
      badgeBg: 'bg-[#FFF886] text-[#05131C]',
    };
  }
  if (status === 'in_progress') {
    return {
      fill: '#FDFCEA',
      border: '#99C3FD',
      glow: 'rgba(153, 195, 253, 0.75)',
      badgeBg: 'bg-[#99C3FD] text-[#05131C]',
    };
  }
  return {
    fill: '#05101A',
    border: '#FDFCEA',
    glow: 'rgba(253, 252, 234, 0.35)',
    badgeBg: 'bg-[#162534] text-[#FDFCEA]',
  };
}

export const MiniRoadmapPreview: React.FC = () => {
  const [nodes, setNodes] = useState<PreviewNode[]>(INITIAL_PREVIEW_NODES);
  const [selectedId, setSelectedId] = useState<string>('js');

  const handleNodeClick = (id: string) => {
    setSelectedId(id);
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: NEXT_STATUS[n.status] } : n))
    );
  };

  const completedCount = nodes.filter(
    (n) => n.status === 'completed' || n.status === 'skipped'
  ).length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);
  const activeNode = nodes.find((n) => n.id === selectedId) || nodes[0];

  return (
    <div className="border border-[#203345] rounded-[32px] bg-[#0A1622] p-6 sm:p-8 lg:p-10 shadow-xl space-y-8">
      {/* Верхняя строка превью */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span
            style={{ fontFamily: 'UnifontExMono, monospace' }}
            className="text-xs uppercase tracking-wider text-[#99C3FD]"
          >
            Интерактивное превью карты
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-[#FDFCEA]">
            Кликните по любому узлу, чтобы сменить статус изучения
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 bg-[#05101A] border border-[#203345] rounded-full px-4 py-2">
            <span className="text-xs text-[#FDFCEA]/75">Прогресс:</span>
            <span
              style={{ fontFamily: 'UnifontExMono, monospace' }}
              className="text-sm font-bold text-[#FFF886]"
            >
              {progressPercent}%
            </span>
          </div>

          <Link
            to="/roadmap"
            className="h-10 px-5 rounded-full bg-[#DDD2FD] hover:bg-[#D1C3FC] text-[#05131C] text-sm font-bold inline-flex items-center gap-2 transition shadow-sm"
          >
            <span>Открыть всю карту</span>
          </Link>
        </div>
      </div>

      {/* Интерактивный граф из 3 узлов с кривыми Безье */}
      <div className="relative rounded-[24px] bg-[#05101A] border border-white/5 px-6 sm:px-12 py-12 overflow-hidden">
        {/* Соединительные кривые Безье (desktop) */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 900 180"
          preserveAspectRatio="none"
        >
          <path
            d="M 180 76 C 300 76, 330 96, 450 96"
            fill="none"
            stroke="#FDFCEA"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 450 96 C 570 96, 600 76, 720 76"
            fill="none"
            stroke="rgba(253, 252, 234, 0.45)"
            strokeWidth="3.5"
            strokeDasharray="7 7"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
          {nodes.map((node, index) => {
            const visuals = getNodeVisuals(node.status);
            const isSelected = node.id === selectedId;
            return (
              <div
                key={node.id}
                className={`flex flex-col items-center text-center space-y-3 ${
                  index === 1 ? 'md:mt-6' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleNodeClick(node.id)}
                  aria-label={`Узел ${node.title}: ${STATUS_LABELS[node.status]}`}
                  className={`w-[54px] h-[54px] rounded-full transition-transform duration-150 cursor-pointer hover:scale-110 ${
                    isSelected ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: visuals.fill,
                    border: `5px solid ${visuals.border}`,
                    boxShadow: `0 0 22px 2px ${visuals.glow}`,
                  }}
                />
                <div className="space-y-1">
                  <div
                    style={{ fontFamily: 'Product Sans Black, Product Sans, sans-serif' }}
                    className="text-[16px] font-black text-white leading-tight"
                  >
                    {node.title}
                  </div>
                  <div className="text-xs text-[#FDFCEA]/60">{node.category}</div>
                  <span
                    className={`inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-semibold ${visuals.badgeBg}`}
                  >
                    {STATUS_LABELS[node.status]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Инфо-строка выбранного узла */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#FDFCEA]/85 bg-[#05101A]/70 border border-white/10 rounded-2xl px-5 py-3.5">
        <div>
          <span className="font-bold text-[#FFF886]">{activeNode.title}:</span>{' '}
          {activeNode.description}
        </div>
        <span className="text-xs text-[#FDFCEA]/55">
          Статус переключается по клику на узел
        </span>
      </div>
    </div>
  );
};
