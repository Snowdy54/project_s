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

  // Строго 3 цвета по новому дизайну: жёлтый (пройдено), голубой (в процессе), чёрный (не начато)
  const getNodeStyles = () => {
    if (node.status === 'completed' || node.status === 'skipped') {
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

    return {
      fill: '#05101A',
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
      {/* Всплывающая палитра статусов */}
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
              title="В изучении"
              onClick={() => onChangeStatus(node.id, 'in_progress')}
              className={`w-6 h-6 rounded-full bg-[#99C3FD] hover:scale-115 transition-transform cursor-pointer ${
                node.status === 'in_progress'
                  ? 'ring-2 ring-white ring-offset-1 ring-offset-[#05101A]'
                  : ''
              }`}
            />
            <button
              type="button"
              title="Изучено / Пропущено"
              onClick={() => onChangeStatus(node.id, 'completed')}
              className={`w-6 h-6 rounded-full bg-[#FFF886] hover:scale-115 transition-transform cursor-pointer ${
                node.status === 'completed' || node.status === 'skipped'
                  ? 'ring-2 ring-white ring-offset-1 ring-offset-[#05101A]'
                  : ''
              }`}
            />
            <button
              type="button"
              title="Не изучено"
              onClick={() => onChangeStatus(node.id, 'not_started')}
              className={`w-6 h-6 rounded-full bg-[#05101A] border-2 border-[#FDFCEA] hover:scale-115 transition-transform cursor-pointer ${
                node.status === 'not_started'
                  ? 'ring-2 ring-[#DDD2FD] ring-offset-1 ring-offset-[#05101A]'
                  : ''
              }`}
            />
          </div>
        </div>
      )}

      {/* Круглый узел */}
      <div
        onClick={() => onSelectNode(node)}
        className="w-[50px] h-[50px] rounded-full transition-transform duration-150 flex items-center justify-center cursor-pointer hover:scale-105"
        style={{
          backgroundColor: styles.fill,
          border: `5px solid ${styles.border}`,
          boxShadow: `0 0 20px 2px ${styles.glow}`,
        }}
      />

      {/* Подпись узла */}
      <div
        onClick={() => onSelectNode(node)}
        className={`absolute left-1/2 -translate-x-1/2 text-center w-[160px] cursor-pointer pointer-events-auto ${
          isLabelTop ? 'bottom-[56px]' : 'top-[56px]'
        }`}
      >
        <span
          style={{ fontFamily: 'Product Sans Black, sans-serif' }}
          className="block font-black text-[15px] leading-[110%] text-white text-center drop-shadow-md"
        >
          {node.title}
        </span>
        <span
          style={{ fontFamily: 'Product Sans, sans-serif' }}
          className="block font-normal text-[12px] leading-[100%] text-gray-400 text-center mt-1"
        >
          {node.category}
        </span>
      </div>
    </div>
  );
};