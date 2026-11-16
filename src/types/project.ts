export type ProjectDifficulty = 'beginner' | 'advanced' | 'deep';

export type ProjectContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; language: string; code: string };

export interface ProjectData {
  id: string;
  direction: string;
  difficulty: ProjectDifficulty;
  title: string;
  shortDescription: string;
  tags: string[];
  estimatedTime: string;
  content: ProjectContentBlock[];
}