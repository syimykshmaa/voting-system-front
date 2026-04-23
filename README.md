# Voting System (Frontend + Backend + MongoDB)

Проект разделен на две части:

- `frontend/` — React + Vite
- `backend/` — Express + MongoDB (Mongoose) + JWT

## 1) Что нужно от вас для подключения MongoDB

Пришлите мне:

- строку подключения `MONGODB_URI`
- при необходимости `PORT` для backend
- при необходимости `CLIENT_ORIGIN` (URL фронта)

Я подставлю это в конфиг.

## 2) Быстрый запуск отдельно

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

По умолчанию backend стартует на `http://localhost:5000`.

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

По умолчанию frontend стартует на `http://localhost:3000`.

## 3) Запуск из корня проекта

```bash
npm install
npm run install:all
npm run dev
```

Эта команда запустит фронт и бэк параллельно.

## 4) Demo-аккаунты

При первом запуске backend автоматически добавляет демо-данные:

- `admin / admin123`
- `manager / manager123`
- `john / john123`
- `jane / jane123`
- `bob / bob123`

## 5) Основные API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST/PUT/DELETE /api/elections`
- `PATCH /api/elections/:id/status`
- `GET/POST /api/votes`
- `GET /api/votes/results/:electionId`
- `GET/POST/PUT/DELETE /api/users` (admin)

## 6) Структура

```text
.
+-- backend
¦   +-- src
¦   ¦   +-- config
¦   ¦   +-- middleware
¦   ¦   +-- models
¦   ¦   +-- routes
¦   ¦   L-- utils
¦   L-- .env.example
+-- frontend
¦   +-- src
¦   L-- .env.example
L-- package.json
```
