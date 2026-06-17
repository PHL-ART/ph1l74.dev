# ph1l74.dev

Персональное портфолио Filat Astakhov — frontend-разработчика, работающего на стыке инженерии и дизайна.

Сайт построен как единая fullstack-платформа: публичная витрина проектов и защищённая админ-панель для их управления. Дизайн — Dark Editorial / Swiss Brutalism: тёплая тёмная палитра в OKLCH, механическая типографика, швейцарская сетка, один строгий акцентный цвет.

## Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 15 (App Router) |
| ORM | Prisma + PostgreSQL |
| Стили | Tailwind CSS + CSS custom properties (OKLCH) |
| Анимации | Framer Motion, raw `motion` |
| Фоновая симуляция | WebGL / LiquidEther (Three.js + кастомный шейдер) |
| Типографика | Big Shoulders Display, Syne, JetBrains Mono, Bricolage Grotesque |
| Язык | TypeScript |

## Структура проекта

```
app/                        # Next.js App Router — страницы и API-роуты
  api/
    projects/               # Публичный API: список проектов, проект по slug
    contacts/               # Публичный API: отправка контакта
    admin/                  # Защищённый CRUD (проекты, категории, теги, изображения, ссылки, сессия)
  admin/                    # UI админ-панели (client component, cookie-авторизация)
  projects/[slug]/          # Публичная страница проекта

src/                        # FSD-структура исходников
  app-pages/                # Полные страницы, подключаемые из app/
    home/ about/ contacts/ projects/
  widgets/                  # Самодостаточные UI-блоки
    home-page-title/ home-page-navigation/ navigation/
  features/                 # Изолированная feature-логика
    project-list/
  entities/                 # Доменные сущности
    project/
      api/projectService.ts # Prisma-запросы
      model/types.ts
  shared/
    api/database/prisma.ts  # Singleton PrismaClient
    lib/admin-auth.ts       # Cookie-авторизация админ-панели
    lib/error-context.tsx   # React error context
    ui/                     # Переиспользуемые UI-примитивы

docs/                       # Документация проекта
  PRODUCT.md                # Продуктовая спецификация: аудитория, цели, бренд
  DESIGN.md                 # Дизайн-система: токены, компоненты, правила
  design/                   # HTML/CSS мокапы страниц
```

## Быстрый старт

### 1. Требования

- Node.js 18+
- PostgreSQL 14+
- npm

### 2. Установка

```bash
git clone https://github.com/ph1l74/ph1l74.dev.git
cd ph1l74.dev
npm install
```

### 3. Переменные окружения

Скопируй `.env.example` в `.env` и заполни значения:

```bash
cp .env.example .env
```

Пример заполненного `.env`:

```env
POSTGRES_USER=ph1l74
POSTGRES_PASSWORD=supersecret
POSTGRES_DB=ph1l74-gallery
POSTGRES_PORT=5432
POSTGRES_IP=localhost

DATABASE_URL="postgresql://ph1l74:supersecret@localhost:5432/ph1l74-gallery?schema=public"

ADMIN_USERNAME=admin
ADMIN_PASSWORD=my-strong-password
```

Подробное описание каждой переменной — в [`.env.example`](.env.example).

### 4. База данных

```bash
# Применить миграции (создать таблицы)
npx prisma migrate dev

# Открыть Prisma Studio (GUI для БД)
npx prisma studio
```

### 5. Запуск

```bash
# Режим разработки
npm run dev

# Продакшн-сборка
npm run build
npm start
```

Сайт откроется на [http://localhost:3000](http://localhost:3000).  
Админ-панель доступна по адресу [http://localhost:3000/admin](http://localhost:3000/admin).

## Управление контентом

Контент (проекты, категории, теги, ссылки, изображения) управляется через встроенную панель `/admin`. Вход защищён паролем, заданным в переменных `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

Авторизация реализована через `httpOnly` cookie: при входе значение `sha256(ADMIN_USERNAME:ADMIN_PASSWORD)` сохраняется в браузере и проверяется на каждом защищённом API-роуте через `src/shared/lib/admin-auth.ts`.

## Полезные команды

```bash
npm run dev                   # Dev-сервер
npm run build                 # Продакшн-сборка
npm run lint                  # ESLint (next lint)

npx prisma migrate dev        # Применить новые миграции
npx prisma generate           # Перегенерировать Prisma Client после изменений схемы
npx prisma studio             # Открыть Prisma Studio
```

## Документация

| Документ | Описание |
|---|---|
| [docs/PRODUCT.md](docs/PRODUCT.md) | Продуктовая спецификация: аудитория, бренд, принципы, анти-референсы |
| [docs/DESIGN.md](docs/DESIGN.md) | Дизайн-система: цветовые токены, типографика, компоненты, правила |
| [docs/design/](docs/design/) | HTML/CSS мокапы страниц сайта |
| [.env.example](.env.example) | Пример переменных окружения с комментариями |
