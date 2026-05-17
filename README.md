# LMS «Управляющий маркетплейсами 2026»

Рабочий MVP backend+frontend для обучения менеджеров маркетплейсов.

## Что уже реализовано

- FastAPI API с базовыми доменными сущностями: Users, Courses, Modules, Lessons, Homework.
- JWT auth (`/auth/register`, `/auth/login`) с сохранением пользователей в БД.
- CRUD-основа для курсов, модулей и уроков.
- Флоу домашних заданий: отправка и teacher review.
- Docker Compose инфраструктура: frontend, backend, postgres, redis, nginx.
- PostgreSQL bootstrap schema.

## Запуск

```bash
docker compose up --build
```

## Основные endpoint'ы

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET/POST /courses`
- `GET/POST /courses/modules`
- `GET/POST /courses/lessons`
- `GET/POST /homework`
- `PATCH /homework/{homework_id}`

## Далее по roadmap

1. Google Drive Sync service (folder scan + material sync).
2. AI SEO Checker (embeddings + vector search).
3. Unit Economics 2026 calculator.
4. Simulator modules and gamification.

---

**Ссылка на чат:** [https://chatgpt.com/s/cd_6a0a0daa84708191a2c28c6c37c1d458](https://chatgpt.com/s/cd_6a0a0daa84708191a2c28c6c37c1d458)
