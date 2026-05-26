# Аудит безопасности и качества кода — LMS «Управляющий маркетплейсами 2026»

Дата аудита: 2026-05-20

## Исправленные уязвимости

### Критические

| # | Проблема | Файл | Статус |
|---|----------|------|--------|
| 1 | `lms.db` и `*.log` закоммичены в репозиторий | `.gitignore`, git history | Исправлено |
| 2 | `SECRET_KEY=super-secret` захардкожен в `docker-compose.yml` | `docker-compose.yml` | Исправлено — вынесено в env |
| 3 | IDOR: студент мог подать задание от имени другого пользователя | `homework.py` | Исправлено — `student_id = current_user.id` |

### Высокие

| # | Проблема | Файл | Статус |
|---|----------|------|--------|
| 4 | CORS `allow_origins=["*"]` + `allow_credentials=True` | `main.py` | Исправлено — origins из `CORS_ORIGINS` env |
| 5 | Нет rate limiting на `/auth/login` и `/auth/register` | `auth.py` | Исправлено — slowapi: 5/мин на login, 10/мин на register |
| 6 | Роль `teacher` доступна при самостоятельной регистрации | `auth.py` | Исправлено — всегда `student` |

### Средние

| # | Проблема | Файл | Статус |
|---|----------|------|--------|
| 7 | `python-jose` (устарела, имеет CVE) | `requirements.txt`, `security.py`, `deps.py` | Исправлено — мигрировано на `PyJWT` |
| 8 | `datetime.utcnow()` deprecated в Python 3.12 | `entities.py` | Исправлено — `datetime.now(timezone.utc)` |
| 9 | Нет Enum-валидации для `lesson_type`, ролей, статусов | `entities.py`, `schemas/homework.py` | Исправлено — добавлены `UserRole`, `LessonType`, `HomeworkStatus` |
| 10 | Порты PostgreSQL (5432) и Redis (6379) открыты на хосте | `docker-compose.yml` | Исправлено — убраны внешние `ports:` |

### Низкие

| # | Проблема | Файл | Статус |
|---|----------|------|--------|
| 11 | `.gitignore` не покрывает `*.log`, `*.db`, `credentials.json` | `.gitignore` | Исправлено |
| 12 | Нет Dockerfile — образы без кэша, `pip install` при каждом запуске | `backend/Dockerfile`, `frontend/Dockerfile` | Исправлено |
| 13 | Все секреты в `docker-compose.yml` напрямую | `docker-compose.yml`, `.env.example` | Исправлено — все через env vars |

## Нераскрытые риски (требуют дополнительной работы)

- **Нет CI/CD**: отсутствуют GitHub Actions для линтинга, тестов и security-сканирования (Bandit, Safety).
- **Токен 24 ч без refresh**: JWT живёт 24 часа, отзыва нет. Redis уже подключён — можно реализовать blacklist или refresh-токены.
- **Нет Alembic**: миграции БД управляются через `Base.metadata.create_all` — не подходит для продакшена.
- **`main`-ветка пустая**: весь MVP находится в feature-ветке, не смёрджен через PR-процесс с ревью.
- **Нет input sanitization** для `tools/yml-validate` — потенциально уязвим к YAML-bomb атакам.

## Не затронутые изменениями (намеренно)

- Структура БД (`schema.sql`) — соответствует моделям, изменения в схеме требуют миграций.
- Frontend: API-вызовы централизованы через `NEXT_PUBLIC_API_URL` (уже было).
- Бизнес-логика сервисов (`economics.py`, `ai_seo.py`) — вне скоупа аудита безопасности.
