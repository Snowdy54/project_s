import type { RoadmapDirectionInfo } from '../types/roadmap';
import { frontendDirectionInfo } from './frontendRoadmapData';

export interface TrackConfig {
  id: string;
  backendId?: number;
  info: RoadmapDirectionInfo;
}

export const ROADMAP_TRACKS: Record<string, TrackConfig> = {
  frontend: {
    id: 'frontend',
    backendId: 1,
    info: frontendDirectionInfo,
  },
  '1': {
    id: 'frontend',
    backendId: 1,
    info: frontendDirectionInfo,
  },
  backend: {
    id: 'backend',
    backendId: 2,
    info: {
      title: 'Backend-разработчик',
      description: {
        overview: 'Проектирование серверной логики, баз данных и отказоустойчивых API.',
        requiredSkills: [
          'Go / Node.js / Python, REST API, SQL (PostgreSQL)',
          'Docker, контейнеризация, кэширование (Redis)',
          'Авторизация (JWT/OAuth), тестирование и архитектура БД',
        ],
        typicalTasks: [
          'Разработка микросервисов, проектирование схем БД, интеграция внешних API.',
        ],
      },
      aiImpact: [
        'ИИ ускоряет генерацию SQL-миграций, шаблонного кода и тестов, но архитектура безопасности и оптимизация запросов остаются за инженером.',
      ],
      relatedDirections: [
        { title: 'Frontend-разработчик', path: '/roadmap' },
        { title: 'DevOps-инженер', path: '/roadmap/devops' },
      ],
    },
  },
  'backend-node': {
    id: 'backend-node',
    backendId: 2,
    info: {
      title: 'Backend Node.js',
      description: {
        overview: 'Создание серверных приложений, REST/GraphQL API и микросервисов на Node.js и TypeScript.',
        requiredSkills: [
          'Node.js, Express / NestJS, TypeScript',
          'PostgreSQL, Redis, очереди сообщений, Docker',
          'Безопасность API, JWT-аутентификация и тестирование',
        ],
        typicalTasks: [
          'Проектирование серверных эндпоинтов, интеграция платежных систем и баз данных.',
        ],
      },
      aiImpact: [
        'ИИ помогает быстро писать CRUD-сервисы и схемы валидации, но построение надежной архитектуры остается ключевым навыком.',
      ],
      relatedDirections: [
        { title: 'Frontend-разработчик', path: '/roadmap' },
        { title: 'Fullstack-разработчик', path: '/roadmap/fullstack' },
      ],
    },
  },
  'ui-ux': {
    id: 'ui-ux',
    info: {
      title: 'UI/UX Дизайн',
      description: {
        overview: 'Проектирование удобных, эстетичных и интуитивных цифровых интерфейсов.',
        requiredSkills: [
          'Figma, дизайн-системы, компонентный подход',
          'UX-исследования, прототипирование, пользовательские сценарии',
          'Типографика, сетки, доступность (a11y) и передача макетов в разработку',
        ],
        typicalTasks: [
          'Проведение интервью с пользователями, сбор CJM, отрисовка макетов и UI-китов.',
        ],
      },
      aiImpact: [
        'Генеративные инструменты ускоряют поиск референсов и прототипирование, но эмпатия к пользователю и логика продукта не заменимы.',
      ],
      relatedDirections: [
        { title: 'Frontend-разработчик', path: '/roadmap' },
        { title: 'Product Manager', path: '/roadmap/product-manager' },
      ],
    },
  },
  fullstack: {
    id: 'fullstack',
    info: {
      title: 'Fullstack-разработчик',
      description: {
        overview: 'Полный цикл разработки веб-приложений: от клиентского интерфейса до баз данных и деплоя.',
        requiredSkills: [
          'React, TypeScript, Next.js',
          'Go / Node.js, PostgreSQL, REST API',
          'Docker, Nginx, CI/CD и облачный деплой',
        ],
        typicalTasks: [
          'Проектирование клиент-серверной архитектуры и сквозная реализация продуктовых фич.',
        ],
      },
      aiImpact: [
        'ИИ выступает вторым пилотом на стыке фронтенда и бэкенда, повышая скорость выпуска MVP в разы.',
      ],
      relatedDirections: [
        { title: 'Frontend-разработчик', path: '/roadmap' },
        { title: 'Backend Node.js', path: '/roadmap/backend-node' },
      ],
    },
  },
  architecture: {
    id: 'architecture',
    info: {
      title: 'Архитектура веб-систем',
      description: {
        overview: 'Проектирование масштабируемых, отказоустойчивых и высоконагруженных веб-платформ.',
        requiredSkills: [
          'Микрофронтенды, модульные монолиты, событийная архитектура',
          'Кэширование, балансировка нагрузки, Core Web Vitals',
          'Наблюдаемость, CI/CD и стратегия тестирования',
        ],
        typicalTasks: [
          'Выбор технологического стека, декомпозиция сервисов и ревью системного дизайна.',
        ],
      },
      aiImpact: [
        'Архитектурные компромиссы и системное мышление становятся главной ценностью инженера на фоне автогенерации кода.',
      ],
      relatedDirections: [
        { title: 'Frontend-разработчик', path: '/roadmap' },
        { title: 'DevOps-инженер', path: '/roadmap/devops' },
      ],
    },
  },
  mobile: {
    id: 'mobile',
    info: {
      title: 'React Native & Mobile',
      description: {
        overview: 'Разработка кроссплатформенных мобильных приложений для iOS и Android на базе React.',
        requiredSkills: [
          'React Native, TypeScript, Expo',
          'Навигация, анимации, нативные модули и офлайн-хранилище',
          'Публикация в App Store и Google Play',
        ],
        typicalTasks: [
          'Верстка мобильных экранов, интеграция push-уведомлений и работа с API устройства.',
        ],
      },
      aiImpact: [
        'ИИ упрощает перенос веб-логики на мобильные платформы и написание нативных бриджей.',
      ],
      relatedDirections: [
        { title: 'Frontend-разработчик', path: '/roadmap' },
        { title: 'UI/UX Дизайн', path: '/roadmap/ui-ux' },
      ],
    },
  },
  devops: {
    id: 'devops',
    backendId: 3,
    info: {
      title: 'DevOps-инженер',
      description: {
        overview: 'Автоматизация процессов сборки, тестирования, деплоя и мониторинга инфраструктуры.',
        requiredSkills: [
          'Linux, Docker, Kubernetes, Nginx',
          'CI/CD (GitHub Actions, GitLab CI), Terraform',
          'Мониторинг и логирование (Prometheus, Grafana)',
        ],
        typicalTasks: [
          'Настройка пайплайнов доставки кода и обеспечение отказоустойчивости сервисов.',
        ],
      },
      aiImpact: [
        'ИИ помогает анализировать инциденты и логи, но финальная надежность продакшена зависит от инженера.',
      ],
      relatedDirections: [
        { title: 'Backend-разработчик', path: '/roadmap/backend' },
        { title: 'Архитектура веб-систем', path: '/roadmap/architecture' },
      ],
    },
  },
};

export function resolveRoadmapTrack(roadmapId?: string): TrackConfig {
  if (!roadmapId) return ROADMAP_TRACKS.frontend;
  const normalized = roadmapId.toLowerCase();
  if (ROADMAP_TRACKS[normalized]) return ROADMAP_TRACKS[normalized];
  return {
    id: normalized,
    info: {
      title: normalized,
      description: {
        overview: 'Изучите ключевые компетенции выбранного направления.',
        requiredSkills: ['Базовые инструменты и практика по направлению'],
        typicalTasks: ['Освоение базовых и продвинутых концепций'],
      },
      aiImpact: ['ИИ дополняет работу специалиста, ускоряя рутинные задачи.'],
      relatedDirections: [{ title: 'Frontend-разработчик', path: '/roadmap' }],
    },
  };
}
