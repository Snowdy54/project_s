import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 100, y: 200 }, data: { label: 'HTML5 & CSS' }, className: 'bg-surface border-2 border-cyan text-white p-3 rounded-xl shadow-lg shadow-cyan/20' },
  { id: '2', position: { x: 350, y: 120 }, data: { label: 'TypeScript' }, className: 'bg-surface border-2 border-cyan text-white p-3 rounded-xl shadow-lg shadow-cyan/20' },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#38BDF8', strokeWidth: 2 } }];

export const RoadmapPage = () => {
  return (
    <div className="w-full h-[calc(100vh-64px)] relative bg-background">
      {/* Виджет прогресса из Figma */}
      <div className="absolute top-6 left-8 z-10 bg-surface/90 border border-border p-4 rounded-2xl flex items-center gap-6 shadow-xl backdrop-blur">
        <div>
          <span className="text-xs text-gray-400 block mb-1">Мой прогресс</span>
          <div className="w-32 bg-gray-700 h-2 rounded-full overflow-hidden">
            <div className="bg-cyan h-full w-[70%]" />
          </div>
        </div>
        <div className="border-l border-border pl-4">
          <span className="text-xs text-gray-400 block">Уровень</span>
          <span className="text-sm font-bold text-cyan">Junior+ (Lvl 2)</span>
        </div>
      </div>

      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Background color="#1E2E3E" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};