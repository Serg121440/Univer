# LMS «Управляющий маркетплейсами 2026»

Современная AI EdTech платформа для подготовки специалистов маркетплейсов.

## Реализованный функционал (MVP+)

1.  **Backend (FastAPI):**
    *   **Безопасность:** JWT Auth (PyJWT), RBAC (Student/Teacher/Admin), Rate Limiting.
    *   **Бизнес-логика:** Управление курсами, модулями, уроками и домашними заданиями.
    *   **Инструменты:** Калькулятор Unit-экономики 2026, AI SEO Checker (mock), YML Validator.
2.  **Frontend (Next.js 15):**
    *   Premium Dark UI на Tailwind CSS + Framer Motion.
    *   Интерактивные дашборды и плеер уроков.
3.  **Инфраструктура:**
    *   Docker Compose с Nginx (Reverse Proxy).
    *   Production-ready Dockerfiles.
    *   Поддержка PaaS (динамические порты, env-секреты).

## Быстрый запуск (Dev)

```bash
docker compose up --build
```
Фронтенд будет доступен на `http://localhost:3000`, бэкенд на `http://localhost:8000`.

## Деплой и Бета-тестирование

Проект готов к деплою для бета-тестов.

### 1. Подготовка окружения
Создайте файл `.env` на базе следующих переменных:

```env
SECRET_KEY=ваша_секретная_строка_минимум_32_символа
POSTGRES_USER=lms
POSTGRES_PASSWORD=надежный_пароль_бд
POSTGRES_DB=lms
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Запуск в Production/Beta
```bash
docker compose up -d
```
Убедитесь, что порты 80 (Nginx) открыты. База данных и Redis теперь изолированы внутри Docker-сети и недоступны снаружи для безопасности.

### 3. Тестирование
```bash
cd backend && PYTHONPATH=. pytest
```

## Безопасность
- Все секреты вынесены из кода.
- Исправлены уязвимости IDOR.
- Реализована защита от брутфорса.
- База данных защищена паролем.
