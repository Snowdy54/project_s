import React, { useState, useEffect } from 'react';
import {
  frontendDirectionInfo,
  initialFrontendNodes,
  initialFrontendEdges,
} from '../../data/frontendRoadmapData';
import type { SkillNodeData, NodeStatus } from '../../types/roadmap';
import { RoadmapHeader } from '../../components/roadmap/RoadmapHeader';
import { RoadmapCanvas } from '../../components/roadmap/RoadmapCanvas';
import { SkillModal } from '../../components/roadmap/SkillModal';
import { AuthWarningModal } from '../../components/roadmap/AuthWarningModal';
import { RoadmapFooterRecommendations } from '../../components/roadmap/RoadmapFooterRecommendations';
import { Footer } from '../../components/layout/Footer';

import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../../utils/storage';

export const RoadmapPage: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() =>
    getStorageItem(STORAGE_KEYS.AUTH, true)
  );
  const [showAuthWarning, setShowAuthWarning] = useState<boolean>(false);

  // Синхронизация статуса авторизации при переключении между вкладками
  useEffect(() => {
    const handleSync = () => {
      setIsAuthorized(getStorageItem(STORAGE_KEYS.AUTH, true));
    };
    window.addEventListener('skillmap-storage-sync', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('skillmap-storage-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Используем ключ v3 для мгновенной загрузки исправленных координат
  const [nodes, setNodes] = useState<SkillNodeData[]>(() => {
    const saved = getStorageItem<SkillNodeData[] | null>(STORAGE_KEYS.ROADMAP_NODES, null);
    if (saved && saved.length === initialFrontendNodes.length && saved[0].labelPosition) {
      return saved;
    }
    return initialFrontendNodes;
  });

  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(null);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ROADMAP_NODES, nodes);
  }, [nodes]);

  const completedCount = nodes.filter(
    (n) => n.status === 'completed' || n.status === 'skipped'
  ).length;
  const progressPercent = Math.round((completedCount / nodes.length) * 100);

  const currentLevel =
    progressPercent < 35
      ? 'Начинающий'
      : progressPercent < 75
      ? 'Продвинутый'
      : 'Углубленный';

  const handleStatusChange = (nodeId: string, newStatus: NodeStatus) => {
    if (!isAuthorized) {
      setShowAuthWarning(true);
      return;
    }

    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id === nodeId) {
          const updatedStatus = n.status === newStatus ? 'not_started' : newStatus;
          const updatedNode = { ...n, status: updatedStatus };
          if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return n;
      })
    );
  };

  const handleExportPDF = () => {
    try {
      window.print();
    } catch {
      alert('Не удалось экспортировать карту. Повторите ещё раз.');
    }
  };

  return (
    <div className="min-h-screen bg-[#05101A] text-white selection:bg-[#FFF886] selection:text-black">
      <main className="w-full px-6 lg:px-[90px] space-y-8 pt-6">
        {/* Дешборд и аккордеоны */}
        <RoadmapHeader
          directionInfo={frontendDirectionInfo}
          progressPercent={progressPercent}
          currentLevel={currentLevel}
          isAuthorized={isAuthorized}
          onToggleAuth={() => {
            const next = !isAuthorized;
            setIsAuthorized(next);
            setStorageItem(STORAGE_KEYS.AUTH, next);
          }}
          onExportPDF={handleExportPDF}
        />

        {/* Относительный контейнер: карта + модальная карточка навыка справа */}
        <section className="relative w-full pt-2">
          <RoadmapCanvas
            nodes={nodes}
            edges={initialFrontendEdges}
            onSelectNode={(node) => setSelectedNode(node)}
            onChangeStatus={handleStatusChange}
          />

          <SkillModal
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onChangeStatus={handleStatusChange}
          />
        </section>

        {/* Логическое продолжение обучения */}
        <section className="pt-4">
          <RoadmapFooterRecommendations />
        </section>
      </main>

      {/* Футер из вкладки Home */}
      <div className="pt-16">
        <Footer />
      </div>

      {/* Окно авторизации для гостей */}
      <AuthWarningModal
        isOpen={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
        onLogin={() => {
          setShowAuthWarning(false);
          setIsAuthorized(true);
          setStorageItem(STORAGE_KEYS.AUTH, true);
        }}
      />
    </div>
  );
};