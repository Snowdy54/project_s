export interface UserLinks {
  github: string;
  vk: string;
  telegram: string;
  website: string;
}

export interface UserProfileData {
  nickname: string;
  email: string;
  phone: string;
  avatarUrl: string;
  links: UserLinks;
}

export interface UserRoadmapProgress {
  id: string;
  title: string;
  progress: number;
  path: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  condition: string;
  points: number;
  type: 'unique' | 'repeatable';
  unlockedCount: number;
}