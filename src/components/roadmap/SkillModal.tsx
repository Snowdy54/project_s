import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen } from 'lucide-react';
import type { SkillNodeData, NodeStatus } from '../../types/roadmap';

interface SkillModalProps {
  node: SkillNodeData | null;
  onClose: () => void;
  onChangeStatus: (nodeId: string, status: NodeStatus) => void;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  node,
  onClose,
  onChangeStatus,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const difficultyLabel = {
    beginner: 'Начинающий',
    advanced: 'Продвинутый',
    deep: 'Углубленный',
  }[node.difficulty];

  const getCategoryBadgeClass = () => {
    switch (node.category) {
      case 'теория':
        return 'bg-[#FFF886] text-black';
      case 'верстка':
        return 'bg-[#DDD2FD] text-black';
      case 'программирование':
        return 'bg-[#99C3FD] text-black';
      case 'инструменты':
        return 'bg-[#FF7116] text-white';
      case 'фреймворки':
        return 'bg-[#DDD2FD] text-black';
      default:
        return 'bg-[#FFF886] text-black';
    }
  };

  return (
    <>
      {/* Прозрачный оверлей над канвасом для закрытия по клику вне карточки */}
      <div className="absolute inset-0 z-30" onClick={onClose} />

      {/* Карточка навыка: h-auto адаптируется под размер контента (максимум до нижнего края карты) */}
      <div
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-40 w-[calc(100%-32px)] sm:w-[470px] h-auto max-h-[calc(100%-48px)] bg-[#FDFCEA] text-black rounded-[36px] p-7 md:p-8 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right-8 duration-200 border border-black/10 select-text"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Категория и закрытие */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${getCategoryBadgeClass()}`}>
            {node.category}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition cursor-pointer text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Заголовок */}
        <div className="space-y-1">
          <h2 className="font-['UnifontExMono',monospace] text-2xl font-bold tracking-tight text-black">
            {node.title}
          </h2>
          <p className="text-xs font-bold text-gray-700">
            Сложность: {difficultyLabel}
          </p>
        </div>

        {/* Описание */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">
            Описание навыка:
          </h3>
          <p className="text-[13px] text-gray-800 leading-relaxed font-normal">
            {node.description}
          </p>
        </div>

        {/* Примеры задач / Необходимые навыки */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">
            Примеры задач / Необходимые навыки:
          </h3>
          <ul className="text-[12px] text-gray-800 space-y-1">
            {node.prerequisites.map((p, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-black font-bold">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ресурсы */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Ресурсы:</span>
          </h3>
          <div className="space-y-2">
            {node.resources.map((res, idx) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="block p-3 rounded-2xl bg-white border border-black/10 hover:border-black/30 transition group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-black group-hover:text-blue-700 transition flex items-center gap-1.5">
                    {idx + 1}. {res.title}
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      res.price === 'Бесплатно' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {res.price}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                  <span>Источник: {res.sourceName}</span>
                  <span>•</span>
                  <span className="capitalize">{res.type}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* Текущий статус */}
        <div className="space-y-2 pb-1">
          <span className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
            Текущий статус:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onChangeStatus(node.id, 'not_started')}
              className={`h-10 rounded-full text-xs font-bold transition flex items-center justify-center px-2 cursor-pointer ${
                node.status === 'not_started'
                  ? 'bg-[#08121A] text-white ring-2 ring-black'
                  : 'bg-black/10 text-gray-700 hover:bg-black/15'
              }`}
            >
              Не изучено
            </button>

            <button
              type="button"
              onClick={() => onChangeStatus(node.id, 'in_progress')}
              className={`h-10 rounded-full text-xs font-bold transition flex items-center justify-center px-2 cursor-pointer ${
                node.status === 'in_progress'
                  ? 'bg-[#99C3FD] text-black ring-2 ring-blue-600 shadow-md'
                  : 'bg-[#99C3FD]/40 text-blue-950 hover:bg-[#99C3FD]/70'
              }`}
            >
              В изучении
            </button>

            <button
              type="button"
              onClick={() => onChangeStatus(node.id, 'completed')}
              className={`h-10 rounded-full text-xs font-bold transition flex items-center justify-center px-2 cursor-pointer ${
                node.status === 'completed'
                  ? 'bg-[#FFF886] text-black ring-2 ring-amber-500 shadow-md'
                  : 'bg-[#FFF886]/50 text-amber-950 hover:bg-[#FFF886]/80'
              }`}
            >
              Изучено
            </button>
          </div>
        </div>
      </div>
    </>
  );
};