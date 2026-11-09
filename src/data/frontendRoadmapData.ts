import type { SkillNodeData, SkillEdgeData, RoadmapDirectionInfo } from '../types/roadmap';

export const frontendDirectionInfo: RoadmapDirectionInfo = {
  title: 'Frontend-разработчик',
  description: {
    overview: 'Создание интерфейсов, с которыми взаимодействует пользователь.',
    requiredSkills: [
      'HTML, CSS, JavaScript (ES6+), React, TypeScript',
      'Инструменты сборки (Vite/Webpack), Git',
      'Клиентская логика, работа с API и оптимизация интерфейсов'
    ],
    typicalTasks: [
      'Верстка макетов, реализация логики на клиенте, работа с API.'
    ]
  },
  aiImpact: [
    'ИИ ускоряет написание шаблонного кода и генерацию тестов, однако глубокое понимание архитектуры и UX остается критически важным для специалиста.'
  ],
  relatedDirections: [
    { title: 'UI/UX Дизайн', path: '/roadmap/ui-ux' },
    { title: 'Backend Node.js', path: '/roadmap/backend-node' }
  ]
};

export const initialFrontendNodes: SkillNodeData[] = [
  // --- 1. НАЧИНАЮЩИЙ ---
  {
    id: 'git-github',
    title: 'Git & GitHub',
    category: 'инструменты',
    difficulty: 'beginner',
    status: 'completed',
    x: 304,
    y: 130,
    labelPosition: 'top',
    description: 'Основы контроля версий: коммиты, ветки, слияния, разрешение конфликтов и работа с удаленными репозиториями.',
    prerequisites: ['Базовые навыки работы с терминалом.'],
    resources: [
      {
        id: 'r4',
        title: 'Learn Git Branching',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://learngitbranching.js.org/?locale=ru_RU',
        sourceName: 'LearnGitBranching'
      }
    ]
  },
  {
    id: 'web-foundation',
    title: 'Web-фундамент',
    category: 'теория',
    difficulty: 'beginner',
    status: 'completed',
    x: 150,
    y: 233,
    labelPosition: 'bottom',
    isRoot: true,
    description: 'Разбираем, как браузер и сервер находят общий язык. Вы узнаете, что на самом деле происходит, когда вы вводите адрес сайта в строку поиска: как работает DNS, что такое HTTP-запросы, клиент-серверная архитектура и базовые принципы REST API. Это база, без которой невозможно писать осознанный код.',
    prerequisites: [
      'Нет (Стартовый узел / Root Node).',
      'Требования: Базовое умение пользоваться браузером и здоровое любопытство к тому, как устроены сайты изнутри.'
    ],
    resources: [
      {
        id: 'r1',
        title: 'MDN Web Docs — раздел «Как работает веб» (How the web works)',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://developer.mozilla.org/ru/docs/Learn/Common_questions/Web_mechanisms/How_does_the_Internet_work',
        sourceName: 'MDN Web Docs'
      },
      {
        id: 'r2',
        title: 'Статья «Что происходит, когда вы вводите URL в браузер»',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://habr.com/ru/articles/522544/',
        sourceName: 'Хабр'
      },
      {
        id: 'r3',
        title: 'YouTube-каналы (Ulearn.me, Владилен Минин) — плейлисты для начинающих',
        type: 'видео',
        price: 'Бесплатно',
        url: 'https://youtube.com',
        sourceName: 'YouTube'
      }
    ]
  },
  {
    id: 'html-semantics',
    title: 'HTML5 & Семантика',
    category: 'верстка',
    difficulty: 'beginner',
    status: 'completed',
    x: 284,
    y: 267,
    labelPosition: 'top',
    description: 'Семантическая разметка страниц, доступность (a11y), теги header, main, nav, section, article.',
    prerequisites: ['Web-фундамент'],
    resources: [
      {
        id: 'r5',
        title: 'Руководство по HTML5',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://doka.guide/html/',
        sourceName: 'Дока'
      }
    ]
  },
  {
    id: 'dom-events',
    title: 'DOM & События',
    category: 'программирование',
    difficulty: 'beginner',
    status: 'completed',
    x: 158,
    y: 378,
    labelPosition: 'bottom',
    description: 'Дерево DOM, поиск элементов, обработчики событий, фазы bubbling и capturing.',
    prerequisites: ['HTML5 & Семантика'],
    resources: [
      {
        id: 'r6',
        title: 'Учебник JavaScript — Документ и события',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://learn.javascript.ru/',
        sourceName: 'learn.javascript.ru'
      }
    ]
  },
  {
    id: 'js-basics',
    title: 'JavaScript Основы',
    category: 'программирование',
    difficulty: 'beginner',
    status: 'completed',
    x: 350,
    y: 454,
    labelPosition: 'bottom',
    description: 'Типы данных, функции, циклы, массивы, объекты, область видимости.',
    prerequisites: ['Web-фундамент'],
    resources: [
      {
        id: 'r7',
        title: 'JavaScript для начинающих',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://stepik.org/',
        sourceName: 'Stepik'
      }
    ]
  },
  {
    id: 'async-js',
    title: 'Асинхронность',
    category: 'программирование',
    difficulty: 'beginner',
    status: 'completed',
    x: 158,
    y: 550,
    labelPosition: 'bottom',
    description: 'Event Loop, промисы (Promises), async/await, обработка ошибок.',
    prerequisites: ['JavaScript Основы'],
    resources: [
      {
        id: 'r8',
        title: 'Понятно про Event Loop',
        type: 'видео',
        price: 'Бесплатно',
        url: 'https://youtube.com',
        sourceName: 'YouTube'
      }
    ]
  },
  {
    id: 'api-work',
    title: 'Работа с API',
    category: 'архитектура и данные',
    difficulty: 'beginner',
    status: 'not_started',
    x: 288,
    y: 612,
    labelPosition: 'bottom',
    description: 'Fetch API, Axios, TanStack Query, обработка состояний загрузки и ошибок.',
    prerequisites: ['Асинхронность'],
    resources: [
      {
        id: 'r17',
        title: 'Клиентские запросы к API',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://doka.guide/js/fetch/',
        sourceName: 'Дока'
      }
    ]
  },
  {
    id: 'routing',
    title: 'Роутинг',
    category: 'фреймворки',
    difficulty: 'beginner',
    status: 'not_started',
    x: 422,
    y: 665,
    labelPosition: 'bottom',
    description: 'React Router v6+, параметры URL, вложенные и защищенные маршруты.',
    prerequisites: ['Работа с API'],
    resources: [
      {
        id: 'r18',
        title: 'React Router Tutorial',
        type: 'официальный сайт',
        price: 'Бесплатно',
        url: 'https://reactrouter.com/',
        sourceName: 'React Router'
      }
    ]
  },

  // --- 2. ПРОДВИНУТЫЙ ---
  {
    id: 'build-tools',
    title: 'Менеджеры & Сборщики',
    category: 'инструменты',
    difficulty: 'advanced',
    status: 'completed',
    x: 480,
    y: 136,
    labelPosition: 'top',
    description: 'npm, pnpm, сборка проектов на Vite, переменные окружения, бандлинг.',
    prerequisites: ['Git & GitHub'],
    resources: [
      {
        id: 'r9',
        title: 'Документация Vite',
        type: 'официальный сайт',
        price: 'Бесплатно',
        url: 'https://vitejs.dev/',
        sourceName: 'Vite'
      }
    ]
  },
  {
    id: 'css-methodologies-1',
    title: 'Методологии CSS',
    category: 'верстка',
    difficulty: 'advanced',
    status: 'not_started',
    x: 568,
    y: 259,
    labelPosition: 'top',
    description: 'БЭМ (Блок-Элемент-Модификатор), организация стилей в проектах.',
    prerequisites: ['CSS3 & Адаптив'],
    resources: [
      {
        id: 'r10',
        title: 'Методология БЭМ',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://ru.bem.info/',
        sourceName: 'BEM'
      }
    ]
  },
  {
    id: 'css-methodologies-2',
    title: 'Методологии CSS',
    category: 'верстка',
    difficulty: 'advanced',
    status: 'not_started',
    x: 766,
    y: 257,
    labelPosition: 'top',
    description: 'CSS Modules, препроцессоры SCSS/Sass и организация стилей.',
    prerequisites: ['Методологии CSS'],
    resources: [
      {
        id: 'r11',
        title: 'SCSS & Модули',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://doka.guide/css/',
        sourceName: 'Дока'
      }
    ]
  },
  {
    id: 'css-responsive',
    title: 'CSS3 & Адаптив',
    category: 'верстка',
    difficulty: 'advanced',
    status: 'completed',
    x: 528,
    y: 368,
    labelPosition: 'bottom',
    description: 'Flexbox, CSS Grid, медиа-запросы, адаптивная и отзывчивая верстка.',
    prerequisites: ['HTML5 & Семантика'],
    resources: [
      {
        id: 'r12',
        title: 'CSS Grid & Flexbox Garden',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://cssgridgarden.com/',
        sourceName: 'Grid Garden'
      }
    ]
  },
  {
    id: 'styling-react',
    title: 'Стилизация в React',
    category: 'фреймворки',
    difficulty: 'advanced',
    status: 'in_progress',
    x: 759,
    y: 427,
    labelPosition: 'bottom',
    description: 'Tailwind CSS, CSS-in-JS, shadcn/ui, изолированные стили компонентов.',
    prerequisites: ['CSS3 & Адаптив', 'React Основы'],
    resources: [
      {
        id: 'r13',
        title: 'Tailwind CSS Documentation',
        type: 'официальный сайт',
        price: 'Бесплатно',
        url: 'https://tailwindcss.com/',
        sourceName: 'Tailwind'
      }
    ]
  },
  {
    id: 'js-es6',
    title: 'JS (ES6+)',
    category: 'программирование',
    difficulty: 'advanced',
    status: 'completed',
    x: 526,
    y: 507,
    labelPosition: 'bottom',
    description: 'Деструктуризация, spread/rest, import/export, стрелочные функции, Map/Set.',
    prerequisites: ['JavaScript Основы'],
    resources: [
      {
        id: 'r14',
        title: 'Современный JavaScript ES6+',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://stepik.org/',
        sourceName: 'Stepik'
      }
    ]
  },
  {
    id: 'react-basics',
    title: 'React Основы',
    category: 'фреймворки',
    difficulty: 'advanced',
    status: 'in_progress',
    x: 673,
    y: 591,
    labelPosition: 'bottom',
    description: 'JSX, функциональные компоненты, props, условный рендеринг, списки и ключи.',
    prerequisites: ['JS (ES6+)'],
    resources: [
      {
        id: 'r15',
        title: 'React Learn',
        type: 'официальный сайт',
        price: 'Бесплатно',
        url: 'https://react.dev/',
        sourceName: 'React Docs'
      }
    ]
  },
  {
    id: 'react-hooks',
    title: 'Хуки & Состояние',
    category: 'фреймворки',
    difficulty: 'advanced',
    status: 'not_started',
    x: 889,
    y: 544,
    labelPosition: 'top',
    description: 'useState, useEffect, useRef, useMemo, useCallback, пользовательские хуки.',
    prerequisites: ['React Основы'],
    resources: [
      {
        id: 'r16',
        title: 'Хуки React',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://react.dev/reference/react',
        sourceName: 'React'
      }
    ]
  },
  {
    id: 'global-state',
    title: 'Управление глобальным состоянием',
    category: 'архитектура и данные',
    difficulty: 'advanced',
    status: 'not_started',
    x: 750,
    y: 753,
    labelPosition: 'bottom',
    description: 'Zustand, Redux Toolkit, управление стейтом крупного веб-приложения.',
    prerequisites: ['React Основы', 'Хуки & Состояние'],
    resources: [
      {
        id: 'r19',
        title: 'Zustand Docs',
        type: 'официальный сайт',
        price: 'Бесплатно',
        url: 'https://zustand.docs.pmnd.rs/',
        sourceName: 'Zustand'
      }
    ]
  },
  {
    id: 'forms-validation',
    title: 'Формы & Валидация',
    category: 'архитектура и данные',
    difficulty: 'advanced',
    status: 'not_started',
    x: 1036,
    y: 751,
    labelPosition: 'bottom',
    description: 'React Hook Form, Zod, контролируемые поля и валидация пользовательского ввода.',
    prerequisites: ['Хуки & Состояние'],
    resources: [
      {
        id: 'r20',
        title: 'React Hook Form Guide',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://react-hook-form.com/',
        sourceName: 'RHF'
      }
    ]
  },

  // --- 3. УГЛУБЛЕННЫЙ ---
  {
    id: 'perf-opt',
    title: 'Оптимизация производительности',
    category: 'качество кода',
    difficulty: 'deep',
    status: 'not_started',
    x: 957,
    y: 183,
    labelPosition: 'top',
    description: 'Code-splitting, React.memo, профилирование рендеров, Core Web Vitals.',
    prerequisites: ['Next.js'],
    resources: [
      {
        id: 'r21',
        title: 'Web Performance Optimization',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://web.dev/fast/',
        sourceName: 'web.dev'
      }
    ]
  },
  {
    id: 'middleware-auth',
    title: 'Middleware и Auth',
    category: 'фреймворки',
    difficulty: 'deep',
    status: 'not_started',
    x: 1285,
    y: 110,
    labelPosition: 'top',
    description: 'JWT-авторизация, cookies, Next.js Middleware, сессии, безопасность.',
    prerequisites: ['Next.js'],
    resources: [
      {
        id: 'r22',
        title: 'Аутентификация в веб-приложениях',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://practicum.yandex.ru/',
        sourceName: 'Практикум'
      }
    ]
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    category: 'фреймворки',
    difficulty: 'deep',
    status: 'not_started',
    x: 1135,
    y: 280,
    labelPosition: 'top',
    description: 'App Router, Server Components (RSC), SSR, SSG, Server Actions.',
    prerequisites: ['TS + React'],
    resources: [
      {
        id: 'r23',
        title: 'Next.js Learn',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://nextjs.org/learn',
        sourceName: 'Next.js'
      }
    ]
  },
  {
    id: 'ts-react',
    title: 'TS + React',
    category: 'программирование',
    difficulty: 'deep',
    status: 'not_started',
    x: 957,
    y: 382,
    labelPosition: 'top',
    description: 'Типизация пропсов, хуков, событий, дженерики в UI-компонентах.',
    prerequisites: ['TypeScript Basics', 'React Основы'],
    resources: [
      {
        id: 'r24',
        title: 'React TypeScript Cheatsheet',
        type: 'официальный сайт',
        price: 'Бесплатно',
        url: 'https://react-typescript-cheatsheet.netlify.app/',
        sourceName: 'TS Cheatsheet'
      }
    ]
  },
  {
    id: 'api-typing',
    title: 'Типизация API-запросов',
    category: 'программирование',
    difficulty: 'deep',
    status: 'not_started',
    x: 1291,
    y: 415,
    labelPosition: 'bottom',
    description: 'OpenAPI генерация типов, tRPC, типобезопасный обмен данными с бэкендом.',
    prerequisites: ['TS + React'],
    resources: [
      {
        id: 'r25',
        title: 'tRPC Документация',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://trpc.io/',
        sourceName: 'tRPC'
      }
    ]
  },
  {
    id: 'ts-basics',
    title: 'TypeScript Basics',
    category: 'программирование',
    difficulty: 'deep',
    status: 'completed',
    x: 1047,
    y: 507,
    labelPosition: 'top',
    description: 'Интерфейсы, union/intersection типы, базовые generics, enum.',
    prerequisites: ['JS (ES6+)'],
    resources: [
      {
        id: 'r26',
        title: 'TypeScript с нуля',
        type: 'курс',
        price: 'Бесплатно',
        url: 'https://stepik.org/',
        sourceName: 'Stepik'
      }
    ]
  },
  {
    id: 'context-reducer',
    title: 'useContext & useReducer',
    category: 'фреймворки',
    difficulty: 'deep',
    status: 'not_started',
    x: 1223,
    y: 593,
    labelPosition: 'bottom',
    description: 'Встроенное управление состоянием без внешних библиотек, контекст, редьюсеры.',
    prerequisites: ['Хуки & Состояние'],
    resources: [
      {
        id: 'r27',
        title: 'Scaling with Reducer and Context',
        type: 'статья',
        price: 'Бесплатно',
        url: 'https://react.dev/',
        sourceName: 'React Docs'
      }
    ]
  }
];

export const initialFrontendEdges: SkillEdgeData[] = [
  { id: 'e1', source: 'web-foundation', target: 'git-github' },
  { id: 'e2', source: 'web-foundation', target: 'html-semantics' },
  { id: 'e3', source: 'web-foundation', target: 'dom-events' },
  { id: 'e4', source: 'git-github', target: 'build-tools' },
  { id: 'e5', source: 'html-semantics', target: 'css-responsive' },
  { id: 'e6', source: 'html-semantics', target: 'js-basics' },
  { id: 'e7', source: 'dom-events', target: 'js-basics' },
  { id: 'e8', source: 'js-basics', target: 'async-js' },
  { id: 'e9', source: 'js-basics', target: 'js-es6' },
  { id: 'e10', source: 'async-js', target: 'api-work', isDashed: true },
  { id: 'e11', source: 'api-work', target: 'routing', isDashed: true },
  { id: 'e12', source: 'css-responsive', target: 'css-methodologies-1', isDashed: true },
  { id: 'e13', source: 'css-methodologies-1', target: 'css-methodologies-2', isDashed: true },
  { id: 'e14', source: 'css-responsive', target: 'styling-react' },
  { id: 'e15', source: 'js-es6', target: 'react-basics' },
  { id: 'e16', source: 'js-es6', target: 'ts-basics' },
  { id: 'e17', source: 'react-basics', target: 'styling-react' },
  { id: 'e18', source: 'react-basics', target: 'react-hooks', isDashed: true },
  { id: 'e19', source: 'react-basics', target: 'global-state', isDashed: true },
  { id: 'e20', source: 'react-hooks', target: 'context-reducer', isDashed: true },
  { id: 'e21', source: 'react-hooks', target: 'forms-validation', isDashed: true },
  { id: 'e22', source: 'ts-basics', target: 'ts-react', isDashed: true },
  { id: 'e23', source: 'ts-react', target: 'nextjs', isDashed: true },
  { id: 'e24', source: 'ts-react', target: 'api-typing', isDashed: true },
  { id: 'e25', source: 'nextjs', target: 'perf-opt', isDashed: true },
  { id: 'e26', source: 'nextjs', target: 'middleware-auth', isDashed: true }
];