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

## Реализованный функционал (MVP)

1.  **Backend (FastAPI):**
    *   Полная схема БД (Users, Courses, Modules, Lessons, Homework).
    *   JWT Auth + Role-Based Access Control (RBAC).
    *   **Unit Economics 2026:** Калькулятор с учетом НДС 2026 и тарифов маркетплейсов.
    *   **AI SEO Checker:** Сервис анализа ключевых слов.
    *   **Google Drive Sync:** Основа для синхронизации материалов.
2.  **Frontend (Next.js 15):**
    *   Premium Dark UI на Tailwind CSS.
    *   Dashboard студента и преподавателя.
    *   Интерактивные инструменты (Calculator, SEO).
    *   Система сдачи ДЗ.

## Запуск

```bash
docker compose up --build
```

## Тестирование

```bash
cd backend && PYTHONPATH=. pytest
```
