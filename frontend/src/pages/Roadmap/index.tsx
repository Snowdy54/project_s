import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useState } from 'react';

// Интерфейс для данных с твоего Go-бэкенда
interface GraphNode {
  skill_id: number;
  skill_name: string;
  ai_responce_for_skill: string;
  status: string;
  skill_dependens: number[];
}

export const RoadmapPage = () => {
  // Состояния для хранения реальных данных из БД
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Делаем запрос к Go-бэкенду при загрузке страницы
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const response = await fetch('/api/graph/1');
        if (!response.ok) {
          throw new Error('Ошибка при загрузке графа с бэкенда');
        }
        const data = await response.json();
        setNodes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, []);

  // Пока данные грузятся, показываем заглушку
  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-64px)] bg-background flex items-center justify-center text-white">
        Загрузка карты навыков...
      </div>
    );
  }

  // Если сервер упал или выдал ошибку, показываем ее
  if (error) {
    return (
      <div className="w-full h-[calc(100vh-64px)] bg-background flex items-center justify-center text-red-500">
        Ошибка: {error}
      </div>
    );
  }

  // Трансформируем данные из БД (GraphNode) в формат, который понимает ReactFlow
  const flowNodes = nodes.map((n, index) => ({
    id: n.skill_id.toString(),
    position: { x: 100 + index * 300, y: 200 + (index % 2 === 0 ? -100 : 100) },
    data: { label: n.skill_name }, // Название навыка из БД
    // Явно задаем стили для узла, перебивая белый фон по умолчанию
    style: {
      backgroundColor: '#16202A', // Темно-синий фон под цвет сайта
      color: '#FFFFFF',           // Белый текст
      border: '2px solid #38BDF8',// Голубая рамка (cyan)
      borderRadius: '12px',       // Скругленные углы
      padding: '16px',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)' // Легкое свечение
    }
  }));

  // Строим связи (ребра) на основе массива skill_dependens из БД
  const flowEdges = nodes.flatMap(n => 
    n.skill_dependens.map(depId => ({
      id: `e${n.skill_id}-${depId}`,
      source: depId.toString(), // От кого зависит
      target: n.skill_id.toString(), // Кто зависит
      animated: true,
      style: { stroke: '#38BDF8', strokeWidth: 2 }
    }))
  );

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

      <ReactFlow nodes={flowNodes} edges={flowEdges} fitView>
        <Background color="#1E2E3E" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};