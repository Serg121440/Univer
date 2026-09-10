'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { apiUrl } from '@/lib/api';

type Role = 'student' | 'teacher' | 'admin';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface Course {
  id: number;
  title: string;
}

interface Module {
  id: number;
  course_id: number;
  title: string;
}

const ROLES: Role[] = ['student', 'teacher', 'admin'];

const ROLE_LABELS: Record<Role, string> = {
  student: 'Студент',
  teacher: 'Преподаватель',
  admin: 'Администратор',
};

const card = 'bg-[#161b2c] p-6 rounded-2xl border border-white/5';
const field =
  'w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors';
const primary =
  'px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

export default function AdminPage() {
  const { token, role } = useAuthStore();
  const router = useRouter();

  const [me, setMe] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const authFetch = useCallback(
    (path: string, init: RequestInit = {}) =>
      fetch(apiUrl(path), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(init.headers ?? {}),
        },
      }),
    [token],
  );

  // Only administrators have anything to do here.
  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
    } else if (role && role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [token, role, router]);

  const reload = useCallback(async () => {
    if (!token) return;
    try {
      const [meRes, usersRes, coursesRes, modulesRes] = await Promise.all([
        authFetch('/users/me'),
        authFetch('/users'),
        authFetch('/courses'),
        authFetch('/courses/modules'),
      ]);
      if (usersRes.status === 403) {
        router.replace('/dashboard');
        return;
      }
      if (meRes.ok) setMe(await meRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (coursesRes.ok) setCourses(await coursesRes.json());
      if (modulesRes.ok) setModules(await modulesRes.json());
    } catch {
      setNotice({ kind: 'error', text: 'Не удалось загрузить данные' });
    }
  }, [authFetch, router, token]);

  useEffect(() => {
    reload();
  }, [reload]);

  const run = async (action: () => Promise<Response>, okText: string) => {
    setBusy(true);
    setNotice(null);
    try {
      const res = await action();
      if (res.ok) {
        setNotice({ kind: 'ok', text: okText });
        await reload();
        return true;
      }
      const data = await res.json().catch(() => ({}));
      const detail = typeof data.detail === 'string' ? data.detail : 'Запрос отклонён';
      setNotice({ kind: 'error', text: detail });
    } catch {
      setNotice({ kind: 'error', text: 'Сервер недоступен' });
    } finally {
      setBusy(false);
    }
    return false;
  };

  const changeRole = (user: AdminUser, next: Role) =>
    run(
      () => authFetch(`/users/${user.id}/role`, { method: 'PATCH', body: JSON.stringify({ role: next }) }),
      `${user.email}: роль изменена на «${ROLE_LABELS[next]}»`,
    );

  if (!token || (role && role !== 'admin')) return null;

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#f6f7fb] p-10">
      <header className="flex flex-wrap gap-4 justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Администрирование</h1>
          <p className="text-white/50 mt-1">Роли пользователей и наполнение курсов</p>
        </div>
        <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
          ← К дашборду
        </Link>
      </header>

      {notice && (
        <p
          className={`mb-8 p-4 rounded-xl border ${
            notice.kind === 'ok'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {notice.text}
        </p>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">Пользователи</h2>
        <div className={`${card} overflow-x-auto`}>
          <table className="w-full text-left min-w-[640px]">
            <thead className="text-white/40 text-xs uppercase tracking-wider">
              <tr>
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Имя</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3">Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-white/5">
                  <td className="py-3 pr-4 text-white/40">{user.id}</td>
                  <td className="py-3 pr-4">{user.name}</td>
                  <td className="py-3 pr-4 text-white/70">{user.email}</td>
                  <td className="py-3">
                    {me && user.id === me.id ? (
                      <span className="text-white/40">{ROLE_LABELS[user.role]} (вы)</span>
                    ) : (
                      <select
                        value={user.role}
                        disabled={busy}
                        onChange={(e) => changeRole(user, e.target.value as Role)}
                        className="bg-[#0b1020] border border-white/10 rounded-lg p-2 focus:outline-none focus:border-blue-500"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/40">
                    Пользователей нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-white/40 text-sm mt-3">
          Свою собственную роль изменить нельзя — иначе платформа может остаться без администратора.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <CourseForm busy={busy} run={run} authFetch={authFetch} />
        <ModuleForm busy={busy} run={run} authFetch={authFetch} courses={courses} />
        <LessonForm busy={busy} run={run} authFetch={authFetch} modules={modules} />
      </section>
    </div>
  );
}

type Runner = (action: () => Promise<Response>, okText: string) => Promise<boolean>;
type AuthFetch = (path: string, init?: RequestInit) => Promise<Response>;

function CourseForm({ busy, run, authFetch }: { busy: boolean; run: Runner; authFetch: AuthFetch }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await run(
      () => authFetch('/courses', { method: 'POST', body: JSON.stringify({ title, description }) }),
      `Курс «${title}» создан`,
    );
    if (ok) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-3`}>
      <h3 className="font-bold mb-1">Новый курс</h3>
      <input className={field} placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea
        className={`${field} h-24`}
        placeholder="Описание"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className={primary} disabled={busy}>
        Создать курс
      </button>
    </form>
  );
}

function ModuleForm({
  busy,
  run,
  authFetch,
  courses,
}: {
  busy: boolean;
  run: Runner;
  authFetch: AuthFetch;
  courses: Course[];
}) {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState(1);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await run(
      () =>
        authFetch('/courses/modules', {
          method: 'POST',
          body: JSON.stringify({ course_id: Number(courseId), title, order }),
        }),
      `Модуль «${title}» создан`,
    );
    if (ok) setTitle('');
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-3`}>
      <h3 className="font-bold mb-1">Новый модуль</h3>
      <select className={field} value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
        <option value="">Курс…</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      <input className={field} placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input
        className={field}
        type="number"
        min={1}
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        placeholder="Порядок"
      />
      <button type="submit" className={primary} disabled={busy || courses.length === 0}>
        Создать модуль
      </button>
      {courses.length === 0 && <p className="text-white/40 text-sm">Сначала создайте курс</p>}
    </form>
  );
}

function LessonForm({
  busy,
  run,
  authFetch,
  modules,
}: {
  busy: boolean;
  run: Runner;
  authFetch: AuthFetch;
  modules: Module[];
}) {
  const [moduleId, setModuleId] = useState('');
  const [title, setTitle] = useState('');
  const [lessonType, setLessonType] = useState('video');
  const [order, setOrder] = useState(1);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await run(
      () =>
        authFetch('/courses/lessons', {
          method: 'POST',
          body: JSON.stringify({ module_id: Number(moduleId), title, lesson_type: lessonType, order }),
        }),
      `Урок «${title}» создан`,
    );
    if (ok) setTitle('');
  };

  return (
    <form onSubmit={submit} className={`${card} space-y-3`}>
      <h3 className="font-bold mb-1">Новый урок</h3>
      <select className={field} value={moduleId} onChange={(e) => setModuleId(e.target.value)} required>
        <option value="">Модуль…</option>
        {modules.map((module) => (
          <option key={module.id} value={module.id}>
            {module.title}
          </option>
        ))}
      </select>
      <input className={field} placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <select className={field} value={lessonType} onChange={(e) => setLessonType(e.target.value)}>
        <option value="video">Видео</option>
        <option value="text">Текст</option>
        <option value="quiz">Тест</option>
        <option value="task">Задание</option>
      </select>
      <input
        className={field}
        type="number"
        min={1}
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        placeholder="Порядок"
      />
      <button type="submit" className={primary} disabled={busy || modules.length === 0}>
        Создать урок
      </button>
      {modules.length === 0 && <p className="text-white/40 text-sm">Сначала создайте модуль</p>}
    </form>
  );
}
