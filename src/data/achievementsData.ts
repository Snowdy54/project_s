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
  {
    id: 'backend',
    title: 'Backend-разработчик',
    progress: 100,
    path: '/roadmap',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    progress: 100,
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
    progress: 100,
    path: '/roadmap',
  },
];

// Каталог из 10 достижений по макету Figma
export const achievementsCatalog: AchievementDefinition[] = [
  {
    id: 'first-step',
    title: 'Первый шаг',
    condition: 'Начать изучение первой интерактивной карты навыков',
    points: 100,
    type: 'unique',
    unlockedCount: 1,
  },
  {
    id: 'pioneer',
    title: 'Первопроходец',
    condition: 'Открыть новое направление и пройти первые узлы карты',
    points: 300,
    type: 'repeatable',
    unlockedCount: 0,
  },
  {
    id: 'first-commit',
    title: 'Первый коммит',
    condition: 'Выполнить первое практическое задание из базы проектов',
    points: 50,
    type: 'unique',
    unlockedCount: 1,
  },
  {
    id: 'year-with-us',
    title: 'Год с нами',
    condition: 'Развивать навыки на платформе MySkill в течение года',
    points: 250,
    type: 'repeatable',
    unlockedCount: 0,
  },
  {
    id: 'ultra-difficulty',
    title: 'Ультра-сложность',
    condition: 'Завершить проект углубленного уровня сложности',
    points: 1500,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'polyglot',
    title: 'Полиглот',
    condition: 'Освоить навыки сразу в нескольких направлениях разработки',
    points: 750,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'code-master',
    title: 'Мастер кода',
    condition: 'Завершить интерактивную карту разработки на 100%',
    points: 500,
    type: 'repeatable',
    unlockedCount: 2,
  },
  {
    id: 'helper',
    title: 'Помощник',
    condition: 'Заполнить профиль и привязать контакты для командной работы',
    points: 500,
    type: 'unique',
    unlockedCount: 0,
  },
  {
    id: 'architecture-guru',
    title: 'Гуру архитектуры',
    condition: 'Освоить все продвинутые и архитектурные узлы карты',
    points: 1000,
    type: 'unique',
    unlockedCount: 1,
  },
  {
    id: 'speedrunner',
    title: 'Спидранер',
    condition: 'Закрыть карту навыков быстрее рекомендованного времени',
    points: 100,
    type: 'repeatable',
    unlockedCount: 1,
  },
];