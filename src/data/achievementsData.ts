import type {
  UserProfileData,
  UserRoadmapProgress,
  AchievementDefinition,
} from '../types/profile';

export const defaultUserProfile: UserProfileData = {
  nickname: 'Александр Скиллмапов',
  email: '',
  phone: '',
  avatarUrl: '',
  links: {
    github: '',
    vk: '',
    telegram: '',
    website: '',
  },
};

export const initialStartedMaps: UserRoadmapProgress[] = [
  {
    id: 'frontend',
    title: 'Frontend-разработчик',
    progress: 48,
    path: '/roadmap',
  },
];

export const initialFavoriteMaps: UserRoadmapProgress[] = [
  {
    id: 'frontend',
    title: 'Frontend-разработчик',
    progress: 48,
    path: '/roadmap',
  },
  {
    id: 'backend',
    title: 'Backend-разработчик',
    progress: 15,
    path: '/roadmap',
  },
];

// Полный список из Дополнения к ЧТЗ «Система достижений»
export const achievementsCatalog: AchievementDefinition[] = [
  {
    id: 'first-peak',
    title: 'Первая вершина',
    condition: 'Завершить первую интерактивную карту (любого уровня сложности)',
    points: 50,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'fullstack',
    title: 'Fullstack',
    condition: 'Завершить карты Backend и Frontend направления',
    points: 200,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'jack-of-all-trades',
    title: 'Мастер на все руки',
    condition: 'Завершить карты Backend, Frontend и DevOps направления',
    points: 300,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'junior-backend',
    title: 'Начинающий Backend-разработчик',
    condition: 'Завершить карту Backend направления',
    points: 100,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'junior-frontend',
    title: 'Начинающий Frontend-разработчик',
    condition: 'Завершить карту Frontend направления',
    points: 100,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'junior-devops',
    title: 'Начинающий DevOps-инженер',
    condition: 'Завершить карту DevOps направления',
    points: 100,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'tip-of-iceberg',
    title: 'Середина айсберга',
    condition: 'Завершить 50% прогресса на любой карте впервые',
    points: 25,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'i-need-this',
    title: 'Это мне надо',
    condition: 'Добавить любую карту в избранное впервые',
    points: 25,
    type: 'unique',
    unlockedCount: 1,
  },
  {
    id: 'practitioner',
    title: 'Практик',
    condition: 'Зайти на страницу базы практик впервые',
    points: 25,
    type: 'unique',
    unlockedCount: 1,
  },
  {
    id: 'start-of-path',
    title: 'Начало пути',
    condition: 'Изменить статус первого узла в новой карте',
    points: 5,
    type: 'repeatable',
    unlockedCount: 2,
  },
  {
    id: 'halfway',
    title: 'Половина пути',
    condition: 'Достичь 50% прогресса в любой карте',
    points: 15,
    type: 'repeatable',
    unlockedCount: 0,
  },
  {
    id: 'mastered-skill',
    title: 'Закреплённый навык',
    condition: 'Завершить любую карту на 100%',
    points: 25,
    type: 'repeatable',
    unlockedCount: 0,
  },
];