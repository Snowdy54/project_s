import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  initialFrontendNodes,
  initialFrontendEdges,
} from '../../data/frontendRoadmapData';
import { resolveRoadmapTrack, type TrackConfig } from '../../data/roadmapTracks';
import type { SkillNodeData, SkillEdgeData, NodeStatus } from '../../types/roadmap';
import { RoadmapHeader } from '../../components/roadmap/RoadmapHeader';
import { RoadmapCanvas } from '../../components/roadmap/RoadmapCanvas';
import { SkillModal } from '../../components/roadmap/SkillModal';
import { AuthWarningModal } from '../../components/roadmap/AuthWarningModal';
import { RoadmapFooterRecommendations } from '../../components/roadmap/RoadmapFooterRecommendations';
import { Footer } from '../../components/layout/Footer';

import { STORAGE_KEYS, getStorageItem, setStorageItem, getAuthToken } from '../../utils/storage';
import { fetchRoadmapById, updateSkillStatus, type BackendRoadmapNode } from '../../utils/api';

function buildInitialFrontendNodes(): SkillNodeData[] {
  const saved = getStorageItem<SkillNodeData[] | null>(STORAGE_KEYS.ROADMAP_NODES, null);
  if (!saved || !Array.isArray(saved)) return initialFrontendNodes;

  const statusById = new Map(saved.map((n) => [n.id, n.status]));
  return initialFrontendNodes.map((n) => ({
    ...n,
    status: statusById.get(n.id) ?? n.status,
  }));
}

function mapBackendNodesToCanvas(backendNodes: BackendRoadmapNode[]): {
  nodes: SkillNodeData[];
  edges: SkillEdgeData[];
} {
  const nodes: SkillNodeData[] = backendNodes.map((bn, idx) => ({
    id: `db-${bn.id}`,
    title: bn.name,
    category: 'программирование',
    difficulty: bn.difficulty,
    status: bn.status,
    x: bn.pos_x || 160 + idx * 200,
    y: bn.pos_y || (idx % 2 === 0 ? 220 : 360),
    labelPosition: idx % 2 === 0 ? 'top' : 'bottom',
    isRoot: idx === 0,
    description: bn.description || bn.name,
    prerequisites: idx > 0 ? [backendNodes[idx - 1].name] : [],
    resources: [],
  }));

  const edges: SkillEdgeData[] = backendNodes.slice(1).map((bn, idx) => ({
    id: `db-e-${backendNodes[idx].id}-${bn.id}`,
    source: `db-${backendNodes[idx].id}`,
    target: `db-${bn.id}`,
  }));

  return { nodes, edges };
}

const RoadmapTrackView: React.FC<{ track: TrackConfig }> = ({ track }) => {
  const isFrontendTrack = track.id === 'frontend';

  const [isAuthorized, setIsAuthorized] = useState<boolean>(() =>
    getStorageItem(STORAGE_KEYS.AUTH, true)
  );
  const [showAuthWarning, setShowAuthWarning] = useState<boolean>(false);
  const backendSkillIdMapRef = useRef<Map<string, number>>(new Map());

  // Синхронизация статуса авторизации при переключении между вкладками
  useEffect(() => {
    const handleSync = () => {
      setIsAuthorized(getStorageItem(STORAGE_KEYS.AUTH, true));
    };
    window.addEventListener('skillmap-storage-sync', handleSync);
    window.addEventListener('auth-changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('skillmap-storage-sync', handleSync);
      window.removeEventListener('auth-changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const [nodes, setNodes] = useState<SkillNodeData[]>(() =>
    isFrontendTrack ? buildInitialFrontendNodes() : []
  );
  const [edges, setEdges] = useState<SkillEdgeData[]>(() =>
    isFrontendTrack ? initialFrontendEdges : []
  );
  const [selectedNode, setSelectedNode] = useState<SkillNodeData | null>(null);

  useEffect(() => {
    if (isFrontendTrack && nodes.length === initialFrontendNodes.length) {
      setStorageItem(STORAGE_KEYS.ROADMAP_NODES, nodes);
    }
  }, [nodes, isFrontendTrack]);

  // Синхронизация узлов и статусов с Go API (/api/roadmaps/{id})
  useEffect(() => {
    if (!track.backendId) return;
    let cancelled = false;
    (async () => {
      try {
        const details = await fetchRoadmapById(track.backendId!);
        if (cancelled || !details?.nodes?.length) return;

        if (isFrontendTrack) {
          const backendByName = new Map(
            details.nodes.map((bn) => [bn.name.trim().toLowerCase(), bn])
          );

          const nextIdMap = new Map<string, number>();
          for (const node of initialFrontendNodes) {
            const match = backendByName.get(node.title.trim().toLowerCase());
            if (match) {
              nextIdMap.set(node.id, match.id);
            }
          }
          backendSkillIdMapRef.current = nextIdMap;

          if (getAuthToken()) {
            setNodes((prevNodes) =>
              prevNodes.map((n) => {
                const match = backendByName.get(n.title.trim().toLowerCase());
                return match ? { ...n, status: match.status } : n;
              })
            );
          }
        } else {
          const mapped = mapBackendNodesToCanvas(details.nodes);
          const nextIdMap = new Map<string, number>();
          details.nodes.forEach((bn) => nextIdMap.set(`db-${bn.id}`, bn.id));
          backendSkillIdMapRef.current = nextIdMap;
          setNodes(mapped.nodes);
          setEdges(mapped.edges);
        }
      } catch {
        // При отсутствии связи с сервером используем локальное состояние
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [track.backendId, isFrontendTrack, isAuthorized]);

  const completedCount = nodes.filter(
    (n) => n.status === 'completed' || n.status === 'skipped'
  ).length;
  const progressPercent =
    nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;

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

    let finalStatus: NodeStatus = newStatus;
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.id === nodeId) {
          const updatedStatus = n.status === newStatus ? 'not_started' : newStatus;
          finalStatus = updatedStatus;
          const updatedNode = { ...n, status: updatedStatus };
          if (selectedNode && selectedNode.id === nodeId) {
            setSelectedNode(updatedNode);
          }
          return updatedNode;
        }
        return n;
      })
    );

    const backendId = backendSkillIdMapRef.current.get(nodeId);
    if (getAuthToken() && backendId) {
      void updateSkillStatus(backendId, finalStatus).catch(() => {
        // Локальный статус уже обновлён
      });
    }
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
          directionInfo={track.info}
          progressPercent={progressPercent}
          currentLevel={currentLevel}
          isAuthorized={isAuthorized}
          onExportPDF={handleExportPDF}
        />

        {/* Относительный контейнер: карта + модальная карточка навыка справа */}
        <section className="relative w-full pt-2">
          {nodes.length > 0 ? (
            <>
              <RoadmapCanvas
                nodes={nodes}
                edges={edges}
                onSelectNode={(node) => setSelectedNode(node)}
                onChangeStatus={handleStatusChange}
              />

              <SkillModal
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                onChangeStatus={handleStatusChange}
              />
            </>
          ) : (
            <div className="w-full h-[460px] rounded-[36px] bg-[#05101A] border border-[#203345] flex flex-col items-center justify-center text-center p-8 space-y-5">
              <div className="space-y-2 max-w-lg">
                <h2
                  style={{ fontFamily: 'UnifontExMono, monospace' }}
                  className="text-2xl text-[#FFF886]"
                >
                  {track.info.title}
                </h2>
                <p className="text-sm text-[#FDFCEA]/75 leading-relaxed">
                  Интерактивное дерево компетенций для направления «{track.info.title}» находится на стадии наполнения на бэкенде. Вы уже можете ознакомиться с описанием трека выше или вернуться к карте Frontend.
                </p>
              </div>
              <Link
                to="/roadmap"
                className="h-11 px-7 rounded-full bg-[#DDD2FD] hover:bg-[#D1C3FC] text-[#05131C] text-sm font-bold inline-flex items-center transition shadow-sm"
              >
                Перейти к карте Frontend-разработчик
              </Link>
            </div>
          )}
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

export const RoadmapPage: React.FC = () => {
  const { roadmapId } = useParams<{ roadmapId?: string }>();
  const track = resolveRoadmapTrack(roadmapId);
  return <RoadmapTrackView key={track.id} track={track} />;
};
