import type { ProjectData } from '../types/project';

export const backendProjectsData: ProjectData[] = [
  {
    id: 'task-tracker-cli',
    direction: 'Backend-разработчик',
    difficulty: 'beginner',
    title: 'Трекер задач',
    shortDescription:
      'Создайте консольное приложение (CLI) для отслеживания задач и управления персональным списком дел.',
    tags: ['CLI', 'JSON', 'Python'],
    estimatedTime: '4-6 часов',
    content: [
      {
        type: 'paragraph',
        text: 'Трекер задач — это проект, предназначенный для отслеживания и управления вашими задачами.',
      },
      {
        type: 'paragraph',
        text: 'В рамках этого задания вы создадите простой интерфейс командной строки (CLI), чтобы отслеживать, что вам нужно сделать, что вы уже сделали и над чем работаете в данный момент. Этот проект поможет вам попрактиковаться в навыках программирования, включая работу с файловой системой, обработку пользовательского ввода и создание простых CLI-приложений.',
      },
      { type: 'heading', text: 'Требования к системе:' },
      {
        type: 'paragraph',
        text: 'Приложение должно запускаться из командной строки, принимать действия и ввод пользователя в качестве аргументов, а также сохранять задачи в JSON-файл.',
      },
      { type: 'subheading', text: 'Пользователь должен иметь возможность:' },
      {
        type: 'list',
        items: [
          'Добавлять, обновлять и удалять задачи',
          'Отмечать задачу как выполняемую (в процессе) или выполненную',
          'Выводить список всех задач',
          'Выводить список всех выполненных задач',
          'Выводить список всех невыполненных задач',
          'Выводить список всех задач, находящихся в процессе выполнения',
        ],
      },
      { type: 'subheading', text: 'Условия реализации:' },
      {
        type: 'list',
        items: [
          'Для создания этого проекта вы можете использовать любой язык программирования',
          'Можно использовать JSON-файл для удобного хранения задач в текущей директории',
          'JSON-файл должен создаваться автоматически, если он еще не существует',
          'Используйте встроенный модуль файловой системы вашего языка программирования для взаимодействия с JSON-файлом',
          'Не используйте внешние библиотеки или фреймворки для создания этого проекта',
          'Обеспечьте корректную и безопасную обработку ошибок и граничных случаев',
        ],
      },
      { type: 'heading', text: 'Примеры команд и ввода/вывода' },
      { type: 'subheading', text: 'Добавление новой задачи:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'add_task.sh',
        code: `# Команда
task-cli add "Купить продукты"

# Вывод
Задача успешно добавлена (ID: 1)`,
      },
      { type: 'subheading', text: 'Обновление и удаление задач:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'update_delete.sh',
        code: `# Обновление описания
task-cli update 1 "Купить продукты и приготовить ужин"

# Удаление задачи
task-cli delete 1`,
      },
      { type: 'subheading', text: 'Отметка задачи как выполняемой или выполненной:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'mark_status.sh',
        code: `# Отметить как "в процессе"
task-cli mark-in-progress 1

# Отметить как "выполнено"
task-cli mark-done 1`,
      },
      { type: 'subheading', text: 'Вывод списка всех задач:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'list_tasks.sh',
        code: `# Все задачи
task-cli list

# Только выполненные
task-cli list done

# Только невыполненные
task-cli list todo

# Только в процессе выполнения
task-cli list in-progress`,
      },
      { type: 'heading', text: 'Бизнес-контракты (Структура данных)' },
      { type: 'subheading', text: 'Структура задачи (JSON Schema):', bold: true },
      {
        type: 'paragraph',
        text: 'Каждая задача должна иметь следующие свойства:',
      },
      {
        type: 'code',
        language: 'json',
        filename: 'task.schema.json',
        code: `{
  "type": "object",
  "properties": {
    "id": {
      "type": "integer",
      "description": "Уникальный идентификатор задачи"
    },
    "description": {
      "type": "string",
      "description": "Краткое описание задачи"
    },
    "status": {
      "type": "string",
      "enum": ["todo", "in-progress", "done"],
      "description": "Статус задачи"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Дата и время создания задачи"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "Дата и время последнего обновления задачи"
    }
  },
  "required": ["id", "description", "status", "createdAt", "updatedAt"]
}`,
      },
      { type: 'subheading', text: 'Пример записи в JSON-файле:' },
      {
        type: 'code',
        language: 'json',
        filename: 'tasks.json',
        code: `{
  "tasks": [
    {
      "id": 1,
      "description": "Купить продукты",
      "status": "todo",
      "createdAt": "2026-11-16T10:00:00Z",
      "updatedAt": "2026-11-16T10:00:00Z"
    },
    {
      "id": 2,
      "description": "Написать код CLI",
      "status": "in-progress",
      "createdAt": "2026-11-16T11:30:00Z",
      "updatedAt": "2026-11-16T12:15:00Z"
    }
  ]
}`,
      },
      { type: 'subheading', text: 'Сигнатуры основных функций (псевдокод):' },
      {
        type: 'code',
        language: 'python',
        filename: 'task_tracker.py',
        code: `# Добавление задачи
def add_task(description: str) -> Task

# Обновление задачи
def update_task(task_id: int, new_description: str) -> Task

# Удаление задачи
def delete_task(task_id: int) -> bool

# Отметка статуса
def mark_in_progress(task_id: int) -> Task
def mark_done(task_id: int) -> Task

# Получение списка
def list_all_tasks() -> List[Task]
def list_tasks_by_status(status: str) -> List[Task]`,
      },
      {
        type: 'heading',
        id: 'step-by-step-guide',
        text: 'Пошаговый гайд для выполнения',
      },
      {
        type: 'steps',
        steps: [
          {
            title: 'Настройка среды разработки',
            boldTitle: true,
            items: [
              'Выберите удобный для вас язык программирования (например, Python, JavaScript и т.д.)',
              'Убедитесь, что у вас установлен редактор кода или IDE (например, VSCode, PyCharm)',
            ],
          },
          {
            title: 'Инициализация проекта',
            boldTitle: true,
            items: [
              'Создайте новую директорию для вашего Task Tracker CLI',
              'Инициализируйте систему контроля версий (например, Git) для управления вашим проектом',
            ],
          },
          {
            title: 'Реализация функционала',
            boldTitle: true,
            items: [
              'Начните с создания базовой структуры CLI для обработки пользовательского ввода',
              'Реализуйте каждую функцию по очереди, тщательно тестируя её перед переходом к следующей',
              'Например, сначала реализуйте функцию добавления задачи, затем вывода списка, потом обновления, отметки о выполнении и т.д.',
            ],
          },
          {
            title: 'Тестирование и отладка',
            boldTitle: true,
            items: [
              'Протестируйте каждую функцию отдельно, чтобы убедиться, что они работают должным образом',
              'Загляните в JSON-файл, чтобы проверить, что задачи сохраняются корректно',
              'Отлаживайте любые проблемы, возникающие в процессе разработки',
            ],
          },
          {
            title: 'Завершение проекта',
            boldTitle: true,
            items: [
              'Убедитесь, что весь функционал реализован и протестирован',
              'Приведите код в порядок и добавьте комментарии там, где это необходимо',
              'Напишите подробный файл README о том, как использовать ваш Task Tracker CLI',
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'Этот проект заложит прочную основу для более сложных задач по программированию и создания реальных приложений.',
      },
    ],
  },
  {
    id: 'url-shortener-api',
    direction: 'Backend-разработчик',
    difficulty: 'advanced',
    title: 'Сервис сокращения ссылок',
    shortDescription:
      'Разработайте RESTful API для сокращения длинных URL: CRUD-операции, уникальные коды, валидация и статистика.',
    tags: ['REST API', 'CRUD', 'JSON', 'HTTP-статусы'],
    estimatedTime: '15-20 часов',
    content: [
      {
        type: 'paragraph',
        text: 'Вам необходимо создать простой, но надежный RESTful API, который позволит пользователям превращать длинные URL-адреса в компактные короткие ссылки.',
      },
      {
        type: 'paragraph',
        text: 'API должен предоставлять конечные точки (эндпоинты) для полного цикла управления ссылками: создания, получения, обновления и удаления. Кроме того, система должна отслеживать и предоставлять статистику о количестве обращений к каждой короткой ссылке.',
      },
      {
        type: 'paragraph',
        italicPrefix: 'Бонусная задача:',
        text: 'по желанию вы можете реализовать минимальный фронтенд для взаимодействия с API и настроить механизм перенаправления (редиректа) с коротких ссылок на исходные URL. Реализация аутентификации или авторизации для этого проекта не требуется.',
      },
      { type: 'heading', text: 'Требования к системе:' },
      {
        type: 'paragraph',
        text: 'Вы должны создать RESTful API, позволяющий пользователям выполнять следующие операции:',
      },
      {
        type: 'list',
        items: [
          'Создание новой короткой ссылки.',
          'Получение исходного URL по короткой ссылке.',
          'Обновление существующей короткой ссылки.',
          'Удаление существующей короткой ссылки.',
          'Получение статистики по короткой ссылке (например, количество обращений accessCount).',
        ],
      },
      { type: 'subheading', text: 'Условия реализации:' },
      {
        type: 'list',
        items: [
          'Вы можете использовать любой язык программирования, фреймворк и базу данных по вашему выбору (например: Node.js + Express, Python + Flask/Django, Java + Spring Boot, Ruby + Rails; MySQL для SQL или MongoDB для NoSQL).',
          'Короткие коды (shortCode) должны быть уникальными и генерироваться случайным образом.',
          'Конечные точки должны строго проверять тело запроса и возвращать корректные HTTP-статусы (201 Created, 200 OK, 400 Bad Request, 404 Not Found).',
          'Ваша задача — реализовать основной функционал API, сосредоточившись на CRUD-операциях и отслеживании статистики.',
        ],
      },
      { type: 'heading', text: 'Примеры команд и ввода/вывода' },
      { type: 'subheading', text: 'Создание короткой ссылки:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'create_short_url.sh',
        code: `# Запрос
POST /shorten
Content-Type: application/json

{
  "url": "https://www.example.com/some/long/url"
}

# Успешный ответ (201 Created)
{
  "id": "1",
  "url": "https://www.example.com/some/long/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z"
}

# Ошибка валидации (400 Bad Request)
{
  "error": "Некорректный формат URL"
}`,
      },
      { type: 'subheading', text: 'Получение исходного URL:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'get_original_url.sh',
        code: `# Запрос
GET /shorten/abc123

# Успешный ответ (200 OK)
{
  "id": "1",
  "url": "https://www.example.com/some/long/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z",
  "accessCount": 5
}

# Ссылка не найдена (404 Not Found)
{
  "error": "Короткая ссылка не найдена"
}`,
      },
      { type: 'subheading', text: 'Обновление короткой ссылки:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'update_short_url.sh',
        code: `# Запрос
PUT /shorten/abc123
Content-Type: application/json

{
  "url": "https://www.example.com/some/updated/url"
}

# Успешный ответ (200 OK)
{
  "id": "1",
  "url": "https://www.example.com/some/updated/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:30:00Z",
  "accessCount": 5
}`,
      },
      { type: 'subheading', text: 'Удаление короткой ссылки:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'delete_short_url.sh',
        code: `# Запрос
DELETE /shorten/abc123

# Успешный ответ (200 OK) со статистикой перед удалением
{
  "id": "1",
  "url": "https://www.example.com/some/long/url",
  "shortCode": "abc123",
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z",
  "accessCount": 10
}`,
      },
      { type: 'heading', text: 'Бизнес-контракты (Структура данных)' },
      {
        type: 'subheading',
        text: 'Структура данных события (JSON Schema):',
        bold: true,
      },
      {
        type: 'paragraph',
        text: 'Каждая запись о короткой ссылке должна содержать следующие обязательные поля:',
      },
      {
        type: 'code',
        language: 'json',
        filename: 'short_url.schema.json',
        code: `{
  "type": "object",
  "properties": {
    "id": { "type": "string", "description": "Уникальный идентификатор записи в БД" },
    "url": { "type": "string", "format": "uri", "description": "Исходный длинный URL" },
    "shortCode": { "type": "string", "description": "Уникальный короткий код (например, 'abc123')" },
    "createdAt": { "type": "string", "format": "date-time", "description": "Дата и время создания" },
    "updatedAt": { "type": "string", "format": "date-time", "description": "Дата и время последнего обновления" },
    "accessCount": { "type": "integer", "minimum": 0, "description": "Счетчик переходов по ссылке" }
  },
  "required": ["id", "url", "shortCode", "createdAt", "updatedAt", "accessCount"]
}`,
      },
      {
        type: 'subheading',
        text: 'Сигнатуры основных функций (псевдокод / TypeScript):',
      },
      {
        type: 'code',
        language: 'json',
        filename: 'shortener.signatures.ts',
        code: `// Генерация уникального короткого кода
function generateShortCode(length: number = 6): string;

// Создание записи с валидацией URL
function createShortUrl(originalUrl: string): Promise<ShortUrl>;

// Получение записи с инкрементом счетчика accessCount
function getAndIncrementUrl(shortCode: string): Promise<ShortUrl | null>;

// Обновление целевого URL
function updateShortUrl(shortCode: string, newUrl: string): Promise<ShortUrl | null>;

// Удаление записи
function deleteShortUrl(shortCode: string): Promise<ShortUrl | null>;`,
      },
      {
        type: 'heading',
        id: 'step-by-step-guide',
        text: 'Пошаговый гайд для выполнения',
      },
      {
        type: 'steps',
        steps: [
          {
            title: 'Выбор стека и инициализация',
            description:
              'Выберите удобный язык и фреймворк (например, Node.js + Express или Python + FastAPI). Инициализируйте проект и установите необходимые зависимости (драйвер для выбранной базы данных, библиотеки для валидации).',
          },
          {
            title: 'Проектирование базы данных',
            description:
              'Создайте таблицу или коллекцию short_urls с полями, указанными в бизнес-контрактах. Обязательно добавьте уникальный индекс на поле shortCode для быстрого поиска и гарантии уникальности.',
          },
          {
            title: 'Реализация POST /shorten',
            description:
              'Напишите эндпоинт, который принимает JSON с полем url. Реализуйте валидацию (проверка на корректный формат URL). Сгенерируйте случайный shortCode, проверьте его на уникальность в БД, сохраните запись и верните ответ со статусом 201 Created.',
          },
          {
            title: 'Реализация GET /shorten/:code',
            description:
              'Напишите эндпоинт, который ищет код в БД. Если запись найдена — увеличьте значение accessCount на 1 и верните данные со статусом 200 OK. Если запись не найдена — верните 404 Not Found.',
          },
          {
            title: 'Реализация PUT и DELETE',
            description:
              'Добавьте возможности обновления целевого URL (с проверкой на существование кода) и безопасного удаления записи (возвращая итоговую статистику перед удалением).',
          },
          {
            title: 'Обработка ошибок',
            description:
              'Убедитесь, что при некорректных данных (например, пустой URL) сервер возвращает 400 Bad Request с понятным JSON-сообщением об ошибке, а не падает с внутренней ошибкой 500.',
          },
        ],
      },
    ],
  },
  {
    id: 'realtime-leaderboard',
    direction: 'Backend-разработчик',
    difficulty: 'deep',
    title: 'Real-time Leaderboard',
    shortDescription:
      'Разработайте бэкенд-систему для ранжирования пользователей: аутентификация, прием очков и рейтинги на базе Redis.',
    tags: ['Redis', 'Real-time', 'High Load', 'API'],
    estimatedTime: '25-35 часов',
    content: [
      {
        type: 'paragraph',
        text: 'Этот проект предполагает создание масштабируемой бэкенд-системы для сервиса рейтингов. Сервис позволит пользователям соревноваться в различных играх или активностях, мгновенно отправлять свои результаты и наблюдать за изменением своих позиций в глобальной таблице лидеров без задержек.',
      },
      {
        type: 'paragraph',
        text: 'Ключевая архитектурная особенность проекта — использование ',
        boldSegment: 'сортированных множеств (Sorted Sets) Redis',
        textAfterBold:
          ' вместо традиционных реляционных запросов для ранжирования. Это обеспечит молниеносное обновление данных и выполнение запросов в реальном времени, что является отраслевым стандартом для современных игровых и спортивных платформ.',
      },
      { type: 'heading', text: 'Требования к системе:' },
      {
        type: 'paragraph',
        text: 'Вам предстоит создать систему, которая ранжирует пользователей на основе их очков. Система должна строго соответствовать следующим требованиям:',
      },
      {
        type: 'list',
        items: [
          {
            boldPrefix: 'Аутентификация пользователей:',
            text: 'Реализация безопасной регистрации и входа в систему (например, через JWT-токены).',
          },
          {
            boldPrefix: 'Отправка результатов:',
            text: 'Эндпоинт для приема и валидации очков пользователя для конкретной игры или активности.',
          },
          {
            boldPrefix: 'Обновление таблицы лидеров:',
            text: 'Механизм отображения глобальной таблицы лидеров, показывающей лучших пользователей (Топ-N) среди всех участников.',
          },
          {
            boldPrefix: 'Рейтинг пользователей:',
            text: 'Возможность для пользователя мгновенно запросить и просмотреть свою текущую позицию в общем зачете, даже если он находится за пределами первой сотни.',
          },
          {
            boldPrefix: 'Отчет о лучших игроках:',
            text: 'Возможность генерации отчетов или срезов данных о лучших игроках за определенный период (например, еженедельный рейтинг).',
          },
        ],
      },
      { type: 'heading', text: 'Примеры команд и ввода/вывода' },
      { type: 'subheading', text: 'Отправка результата:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'submit_score.sh',
        code: `# Запрос
POST /api/games/chess-2024/scores
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "score": 1540,
  "metadata": { "duration_sec": 300, "opponent_id": "user_99" }
}

# Успешный ответ (201 Created)
{
  "success": true,
  "message": "Результат успешно сохранен и рейтинг обновлен",
  "newRank": 42
}`,
      },
      { type: 'subheading', text: 'Получение глобальной таблицы лидеров:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'get_leaderboard.sh',
        code: `# Запрос
GET /api/leaderboard?gameId=chess-2024&limit=10

# Успешный ответ (200 OK)
{
  "gameId": "chess-2024",
  "totalPlayers": 15430,
  "leaders": [
    { "rank": 1, "userId": "user_01", "username": "GrandMaster", "score": 2800 },
    { "rank": 2, "userId": "user_45", "username": "ChessKing", "score": 2750 }
  ]
}`,
      },
      { type: 'subheading', text: 'Получение личного рейтинга:' },
      {
        type: 'code',
        language: 'bash',
        filename: 'get_personal_rank.sh',
        code: `# Запрос
GET /api/users/me/rank?gameId=chess-2024

# Успешный ответ (200 OK)
{
  "userId": "user_123",
  "username": "CurrentPlayer",
  "score": 1540,
  "rank": 42,
  "percentile": 95.5
}`,
      },
      { type: 'heading', text: 'Бизнес-контракты (Структура данных)' },
      {
        type: 'subheading',
        text: 'Структура данных события (JSON Schema):',
        bold: true,
      },
      {
        type: 'paragraph',
        text: 'Каждая задача должна иметь следующие свойства:',
      },
      {
        type: 'code',
        language: 'json',
        filename: 'score_event.schema.json',
        code: `{
  "type": "object",
  "properties": {
    "userId": { "type": "string", "format": "uuid", "description": "ID пользователя" },
    "gameId": { "type": "string", "description": "Идентификатор игры/активности" },
    "score": { "type": "integer", "minimum": 0, "description": "Набранные очки" },
    "timestamp": { "type": "string", "format": "date-time" }
  },
  "required": ["userId", "gameId", "score", "timestamp"]
}`,
      },
      {
        type: 'paragraph',
        boldPrefix: 'Ключевые команды Redis (Sorted Sets) для реализации:',
        text: 'Поскольку Redis является основным хранилищем для рейтингов, разработчик должен использовать следующие операции:',
      },
      {
        type: 'list',
        items: [
          {
            boldPrefix: 'Добавление/обновление очков:',
            text: '',
            monoSuffix: 'ZADD leaderboard:{gameId} {score} "{userId}"',
          },
          {
            boldPrefix: 'Получение топ-10 игроков (по убыванию):',
            text: '',
            monoSuffix: 'ZREVRANGE leaderboard:{gameId} 0 9 WITHSCORES',
          },
          {
            boldPrefix: 'Получение ранга конкретного пользователя:',
            text: '',
            monoSuffix: 'ZREVRANK leaderboard:{gameId} "{userId}"',
          },
          {
            boldPrefix: 'Подсчет общего числа игроков:',
            text: '',
            monoSuffix: 'ZCARD leaderboard:{gameId}',
          },
        ],
      },
      {
        type: 'heading',
        id: 'step-by-step-guide',
        text: 'Пошаговый гайд для выполнения',
      },
      {
        type: 'steps',
        steps: [
          {
            title: 'Настройка среды и аутентификация',
            boldTitle: true,
            items: [
              'Выберите язык программирования и фреймворк. Инициализируйте проект.',
              'Подключите реляционную БД (например, PostgreSQL) для хранения профилей пользователей.',
              'Реализуйте эндпоинты регистрации и входа с генерацией JWT-токенов.',
            ],
          },
          {
            title: 'Интеграция Redis',
            boldTitle: true,
            items: [
              'Поднимите экземпляр Redis (рекомендуется использовать Docker).',
              'Подключите Redis-клиент к вашему приложению. Изучите документацию по командам работы с Sorted Sets.',
            ],
          },
          {
            title: 'Реализация отправки очков',
            boldTitle: true,
            items: [
              'Создайте защищенный (требующий JWT) эндпоинт для приема результатов.',
              'Реализуйте логику, которая атомарно обновляет счет пользователя в Redis с помощью команды ZADD.',
            ],
          },
          {
            title: 'Реализация чтения рейтингов',
            boldTitle: true,
            items: [
              'Напишите эндпоинт для получения глобального топа с использованием ZREVRANGE.',
              'Напишите эндпоинт для получения личного ранга с использованием ZREVRANK. Обработайте граничный случай, когда пользователя еще нет в таблице.',
            ],
          },
          {
            title: 'Тестирование и отладка',
            boldTitle: true,
            items: [
              'Протестируйте API с помощью Postman или cURL.',
              {
                italicPrefix: '(Опционально, для уровня Advanced):',
                text: 'Проведите нагрузочное тестирование (например, с помощью k6), отправив 1000+ запросов на обновление очков в секунду, чтобы убедиться в эффективности Redis.',
              },
            ],
          },
          {
            title: 'Завершение проекта',
            boldTitle: true,
            items: [
              'Приведите код в порядок, добавьте комментарии к сложным участкам логики.',
              'Напишите подробный файл README.md с инструкцией по запуску (включая docker-compose.yml) и примерами API-запросов.',
            ],
          },
        ],
      },
      {
        type: 'paragraph',
        text: 'Этот проект заложит прочную основу для более сложных задач по программированию и создания реальных приложений.',
      },
    ],
  },
];