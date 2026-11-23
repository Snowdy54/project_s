export type ProjectDifficulty = 'beginner' | 'advanced' | 'deep';

export interface ProjectListItem {
  boldPrefix?: string;
  italicPrefix?: string;
  text: string;
  monoSuffix?: string;
}

export interface ProjectStepItem {
  title: string;
  description?: string;
  items?: (string | ProjectListItem)[];
  boldTitle?: boolean;
}

export type ProjectContentBlock =
  | {
      type: 'paragraph';
      text: string;
      italicPrefix?: string;
      boldPrefix?: string;
      boldSegment?: string;
      textAfterBold?: string;
    }
  | { type: 'heading'; text: string; id?: string }
  | { type: 'subheading'; text: string; bold?: boolean }
  | { type: 'list'; items: (string | ProjectListItem)[] }
  | { type: 'steps'; steps: ProjectStepItem[] }
  | { type: 'code'; language: string; filename?: string; code: string };

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