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

export type NodeStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export type NodeDifficulty = 'beginner' | 'advanced' | 'deep';

export type NodeCategory = 
  | 'теория' 
  | 'верстка' 
  | 'программирование' 
  | 'инструменты' 
  | 'фреймворки' 
  | 'архитектура и данные' 
  | 'качество кода';

export interface SkillResource {
  id: string;
  title: string;
  type: 'статья' | 'курс' | 'официальный сайт' | 'видео';
  price: 'Бесплатно' | 'Платно';
  url: string;
  sourceName: string;
}

export interface SkillNodeData {
  id: string;
  title: string;
  category: NodeCategory;
  difficulty: NodeDifficulty;
  status: NodeStatus;
  x: number;
  y: number;
  labelPosition?: 'top' | 'bottom';
  isRoot?: boolean;
  hasUserBadge?: boolean;
  description: string;
  prerequisites: string[];
  resources: SkillResource[];
}

export interface SkillEdgeData {
  id: string;
  source: string;
  target: string;
  isDashed?: boolean;
}

export interface RoadmapDirectionInfo {
  title: string;
  description: {
    overview: string;
    requiredSkills: string[];
    typicalTasks: string[];
  };
  aiImpact: string[];
  relatedDirections: { title: string; path: string }[];
}