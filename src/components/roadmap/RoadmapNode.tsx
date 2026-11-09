import React, { useState } from 'react';
import type { SkillNodeData, NodeStatus } from '../../types/roadmap';

interface RoadmapNodeProps {
  node: SkillNodeData;
  onSelectNode: (node: SkillNodeData) => void;
  onChangeStatus: (nodeId: string, status: NodeStatus) => void;
}

export const RoadmapNode: React.FC<RoadmapNodeProps> = ({
  node,
  onSelectNode,
  onChangeStatus,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLabelTop = node.labelPosition === 'top';

  const getNodeStyles = () => {
    if (node.status === 'completed') {
      if (node.category === 'инструменты') {
        return {
          fill: '#FDFCEA',
          border: '#FF7116',
          glow: 'rgba(255, 113, 22, 0.75)',
        };
      }
      if (node.category === 'верстка') {
        return {
          fill: '#FDFCEA',
          border: '#FFF886',
          glow: 'rgba(255, 248, 134, 0.75)',
        };
      }
      if (node.category === 'фреймворки') {
        return {
          fill: '#FDFCEA',
          border: '#DDD2FD',
          glow: 'rgba(221, 210, 253, 0.75)',
        };
      }
      return {
        fill: '#FDFCEA',
        border: '#FFF886',
        glow: 'rgba(255, 248, 134, 0.75)',
      };
    }

    if (node.status === 'in_progress') {
      return {
        fill: '#FDFCEA',
        border: '#99C3FD',
        glow: 'rgba(153, 195, 253, 0.75)',
      };
    }

    // not_started: цвет фона #05131C и светлая обводка #FDFCEA
    return {
      fill: '#05131C',
      border: '#FDFCEA',
      glow: 'rgba(253, 252, 234, 0.35)',
    };
  };

  const styles = getNodeStyles();

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ left: `${node.x}px`, top: `${node.y}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Палитра смены статуса (всплывает с противоположной стороны от названия) */}
      {isHovered && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-40 animate-in fade-in duration-100 ${
            isLabelTop ? 'top-[30px] pt-3' : '-top-[50px] pb-3'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#4A5560]/85 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2.5 shadow-2xl border border-white/10">
            <button
              type="button"
              title="В процессе обучения"
              onClick={() => onChangeStatus(node.id, 'in_progress')}
              className={`w-6 h-6 rounded-full bg-[#99C3FD] hover:scale-115 transition-transform cursor-pointer ${
                node.status === 'in_progress' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#05131C]' : ''
              }`}
            />
            <button
              type="button"
              title="Пройдено"
              onClick={() => onChangeStatus(node.id, 'completed')}
              className={`w-6 h-6 rounded-full bg-[#FFF886] hover:scale-115 transition-transform cursor-pointer ${
                node.status === 'completed' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#05131C]' : ''
              }`}
            />
            <button
              type="button"
              title="Не начато"
              onClick={() => onChangeStatus(node.id, 'not_started')}
              className={`w-6 h-6 rounded-full bg-[#05131C] border-2 border-[#FDFCEA] hover:scale-115 transition-transform cursor-pointer ${
                node.status === 'not_started' ? 'ring-2 ring-[#DDD2FD] ring-offset-1 ring-offset-[#05131C]' : ''
              }`}
            />
          </div>
        </div>
      )}

      {/* Узел 50x50 px, обводка 5px */}
      <div
        onClick={() => onSelectNode(node)}
        className="w-[50px] h-[50px] rounded-full transition-transform duration-150 flex items-center justify-center cursor-pointer hover:scale-105"
        style={{
          backgroundColor: styles.fill,
          border: `5px solid ${styles.border}`,
          boxShadow: `0 0 20px 2px ${styles.glow}`,
        }}
      />

      {/* Текст: сверху (bottom-[56px]) или снизу (top-[56px]) по макету */}
      <div
        onClick={() => onSelectNode(node)}
        className={`absolute left-1/2 -translate-x-1/2 text-center w-[160px] cursor-pointer pointer-events-auto ${
          isLabelTop ? 'bottom-[56px]' : 'top-[56px]'
        }`}
      >
        <span className="block font-['Product_Sans_Black',sans-serif] font-black text-[15px] leading-[110%] text-white text-center drop-shadow-md">
          {node.title}
        </span>
        <span className="block font-['Product_Sans',sans-serif] font-normal text-[12px] leading-[100%] text-gray-400 text-center mt-1">
          {node.category}
        </span>
      </div>
    </div>
  );
};