export interface SkillNode {
  id: string;
  title: string;
  level: 'junior' | 'middle' | 'senior';
  status: 'locked' | 'in_progress' | 'completed';
}

export interface SkillEdge {
  id: string;
  source: string;
  target: string;
}

export interface RoadmapData {
  specialty: string;
  nodes: SkillNode[];
  edges: SkillEdge[];
}