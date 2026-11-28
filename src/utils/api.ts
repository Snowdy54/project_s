import { getAuthToken } from './storage';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError('Сервер недоступен. Проверьте подключение.', 0);
  }

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errMsg =
      (data && typeof data === 'object' && 'error' in data && typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : null) || `Ошибка сервера (${response.status})`;
    throw new ApiError(errMsg, response.status);
  }

  return data as T;
}

export interface AuthResponse {
  token: string;
  user_id: number;
  nickname: string;
}

export interface BackendUserProfile {
  id: number;
  nickname: string;
  email: string;
  phone: string;
  avatar_url: string;
  github_url: string;
  vk_url: string;
  telegram_url: string;
  website_url: string;
}

export interface BackendActivityRoadmap {
  id: number;
  title: string;
  progress_percent: number;
}

export interface BackendProfileResponse {
  profile: BackendUserProfile;
  started_roadmaps: BackendActivityRoadmap[];
  favorite_roadmaps: BackendActivityRoadmap[];
}

export interface BackendAchievementItem {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  type: 'unique' | 'repeatable';
  earned_count: number;
}

export interface BackendAchievementsResponse {
  total_points: number;
  all_achievements: BackendAchievementItem[];
}

export interface BackendRoadmapNode {
  id: number;
  name: string;
  description: string;
  difficulty: 'beginner' | 'advanced' | 'deep';
  pos_x: number;
  pos_y: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
}

export interface BackendRoadmapDetails {
  id: number;
  title: string;
  progress_percent: number;
  hh_key_skills: string[];
  nodes: BackendRoadmapNode[];
}

export function loginUser(contact: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ contact, password }),
  });
}

export function registerUser(
  nickname: string,
  contact: string,
  password: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nickname, contact, password }),
  });
}

export function githubAuth(): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/auth/github', {
    method: 'POST',
  });
}

export function fetchProfile(): Promise<BackendProfileResponse> {
  return apiFetch<BackendProfileResponse>('/profile');
}

export function updateProfile(payload: {
  nickname: string;
  email: string;
  phone: string;
  avatar_url: string;
  github_url: string;
  vk_url: string;
  telegram_url: string;
  website_url: string;
}): Promise<{ status: string; message: string }> {
  return apiFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteProfile(confirmation: string): Promise<{ status: string; message: string }> {
  return apiFetch('/profile', {
    method: 'DELETE',
    body: JSON.stringify({ confirmation }),
  });
}

export function fetchAchievements(): Promise<BackendAchievementsResponse> {
  return apiFetch<BackendAchievementsResponse>('/profile/achievements');
}

export function fetchRoadmapById(roadmapId: number): Promise<BackendRoadmapDetails> {
  return apiFetch<BackendRoadmapDetails>(`/roadmaps/${roadmapId}`);
}

export function updateSkillStatus(
  skillId: number,
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped'
): Promise<{ status: string }> {
  return apiFetch(`/skills/${skillId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function removeFavoriteRoadmap(roadmapId: number): Promise<{ status: string }> {
  return apiFetch(`/roadmaps/${roadmapId}/favorite`, {
    method: 'DELETE',
  });
}
