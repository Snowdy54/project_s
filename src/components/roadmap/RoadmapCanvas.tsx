import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { SkillNodeData, SkillEdgeData, NodeStatus } from '../../types/roadmap';
import { RoadmapNode } from './RoadmapNode';

interface RoadmapCanvasProps {
  nodes: SkillNodeData[];
  edges: SkillEdgeData[];
  onSelectNode: (node: SkillNodeData) => void;
  onChangeStatus: (nodeId: string, status: NodeStatus) => void;
}

export const RoadmapCanvas: React.FC<RoadmapCanvasProps> = ({
  nodes,
  edges,
  onSelectNode,
  onChangeStatus,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showCtrlHint, setShowCtrlHint] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let hintTimer: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        setScale((prev) => Math.min(Math.max(prev * zoomFactor, 0.45), 1.9));
      } else {
        setShowCtrlHint(true);
        clearTimeout(hintTimer);
        hintTimer = setTimeout(() => setShowCtrlHint(false), 1200);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      clearTimeout(hintTimer);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const renderEdge = (edge: SkillEdgeData) => {
    const source = nodes.find((n) => n.id === edge.source);
    const target = nodes.find((n) => n.id === edge.target);
    if (!source || !target) return null;

    const dx = Math.abs(target.x - source.x);
    const c1x = source.x + dx * 0.5;
    const c1y = source.y;
    const c2x = target.x - dx * 0.5;
    const c2y = target.y;

    const pathData = `M ${source.x} ${source.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${target.x} ${target.y}`;

    return (
      <path
        key={edge.id}
        d={pathData}
        fill="none"
        stroke={edge.isDashed ? 'rgba(253, 252, 234, 0.35)' : '#FDFCEA'}
        strokeWidth="3.5"
        strokeDasharray={edge.isDashed ? '7 7' : undefined}
        strokeLinecap="round"
      />
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ backgroundColor: '#05101A' }}
      className={`relative w-full h-[760px] rounded-[36px] overflow-hidden select-none border-0 shadow-none bg-[#05101A] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* 1. Уровни тем: зафиксированы сверху (Sticky Y), двигаются по оси X */}
      <div className="absolute top-4 left-0 w-full pointer-events-none z-20 overflow-hidden h-9">
        <div
          className={`h-full flex items-center ${
            isDragging ? '' : 'transition-transform duration-200 ease-out'
          }`}
          style={{
            transform: `translate3d(${position.x}px, 0, 0) scale(${scale})`,
            transformOrigin: 'top left',
            width: '1600px',
            willChange: 'transform',
            fontFamily: 'UnifontExMono, monospace',
          }}
        >
          <div className="w-[480px] pl-8">
            <span className="text-white/90 bg-[#05101A]/90 px-3 py-1 rounded-md text-[14px] font-medium">
              | Начинающий
            </span>
          </div>
          <div className="w-[570px] pl-8">
            <span className="text-white/90 bg-[#05101A]/90 px-3 py-1 rounded-md text-[14px] font-medium">
              | Продвинутый
            </span>
          </div>
          <div className="flex-1 pl-8">
            <span className="text-white/90 bg-[#05101A]/90 px-3 py-1 rounded-md text-[14px] font-medium">
              | Углубленный
            </span>
          </div>
        </div>
      </div>

      {/* Подсказка о зуме */}
      {showCtrlHint && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-[#0C1924]/90 border border-white/20 text-[#FFF886] px-5 py-2 rounded-full text-xs font-bold shadow-2xl z-30 pointer-events-none animate-in fade-in duration-150">
          Зажмите Ctrl + колесо мыши для зума карты
        </div>
      )}

      {/* Кнопки зума */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 bg-[#0C1924]/90 backdrop-blur-md border border-[#203345] p-1.5 rounded-full shadow-xl">
        <button
          type="button"
          onClick={() => setScale((s) => Math.min(s * 1.15, 1.9))}
          className="w-9 h-9 rounded-full bg-[#162534] hover:bg-[#203548] text-white flex items-center justify-center transition cursor-pointer"
          title="Приблизить"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setScale((s) => Math.max(s * 0.85, 0.45))}
          className="w-9 h-9 rounded-full bg-[#162534] hover:bg-[#203548] text-white flex items-center justify-center transition cursor-pointer"
          title="Отдалить"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={resetView}
          className="w-9 h-9 rounded-full bg-[#162534] hover:bg-[#203548] text-white flex items-center justify-center transition cursor-pointer"
          title="Сбросить масштаб"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Холст с узлами и связями */}
      <div
        className={`w-[1600px] h-[960px] absolute origin-top-left ${
          isDragging ? '' : 'transition-transform duration-200 ease-out'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
          willChange: 'transform',
        }}
      >
        {/* Разделительные линии колонок */}
        <div className="absolute top-12 left-[480px] h-[880px] w-px bg-white/5 pointer-events-none" />
        <div className="absolute top-12 left-[1050px] h-[880px] w-px bg-white/5 pointer-events-none" />

        {/* Связи */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          {edges.map(renderEdge)}
        </svg>

        {/* Узлы */}
        {nodes.map((node) => (
          <RoadmapNode
            key={node.id}
            node={node}
            onSelectNode={onSelectNode}
            onChangeStatus={onChangeStatus}
          />
        ))}
      </div>
    </div>
  );
};