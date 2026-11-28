import type { SkillNodeData } from '../types/roadmap';

export function computeEdgePath(
  source: Pick<SkillNodeData, 'id' | 'x' | 'y'>,
  target: Pick<SkillNodeData, 'id' | 'x' | 'y'>,
  allNodes: Array<Pick<SkillNodeData, 'id' | 'x' | 'y'>> = []
): string {
  const dx = Math.abs(target.x - source.x);
  const dy = Math.abs(target.y - source.y);

  // Для длинных почти горизонтальных связей добавляем мягкую дугу Безье в обход соседних узлов
  if (dx > 200 && dy < 30) {
    const minX = Math.min(source.x, target.x) + 40;
    const maxX = Math.max(source.x, target.x) - 40;
    const midY = (source.y + target.y) / 2;

    let nodesAbove = 0;
    let nodesBelow = 0;
    for (const n of allNodes) {
      if (n.id === source.id || n.id === target.id) continue;
      if (n.x >= minX && n.x <= maxX) {
        if (n.y < midY && midY - n.y < 95) nodesAbove++;
        if (n.y >= midY && n.y - midY < 95) nodesBelow++;
      }
    }

    const archOffset = nodesAbove <= nodesBelow ? -42 : 42;
    const c1x = source.x + (target.x - source.x) * 0.35;
    const c2x = source.x + (target.x - source.x) * 0.65;
    return `M ${source.x} ${source.y} C ${c1x} ${source.y + archOffset}, ${c2x} ${target.y + archOffset}, ${target.x} ${target.y}`;
  }

  const curveX = Math.max(dx * 0.5, 40);
  const signX = target.x >= source.x ? 1 : -1;
  const c1x = source.x + curveX * signX;
  const c1y = source.y;
  const c2x = target.x - curveX * signX;
  const c2y = target.y;

  return `M ${source.x} ${source.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${target.x} ${target.y}`;
}
