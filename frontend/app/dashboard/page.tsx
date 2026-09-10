'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';

export default function DashboardPage() {
  const { token, role, logout } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  // Without a session there is nothing to show — and "Выйти" would look broken.
  useEffect(() => {
    if (!token) router.replace('/auth/login');
  }, [token, router]);

  useEffect(() => {
    fetch(apiUrl('/courses'))
      .then(res => res.json())
      .then(data => setCourses(data));
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-[#f6f7fb] p-10">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Панель управления</h1>
          <p className="text-white/50 mt-1">Добро пожаловать, роль: <span className="text-blue-400 font-medium">{role}</span></p>
        </div>
        <div className="flex items-center gap-6">
           {role === 'admin' && (
             <Link href="/admin" className="hover:text-blue-400 transition-colors">Администрирование</Link>
           )}
           <Link href="/tools/calculator" className="hover:text-blue-400 transition-colors">Калькулятор 2026</Link>
           <Link href="/tools/seo" className="hover:text-blue-400 transition-colors">SEO Checker</Link>
           <button onClick={handleLogout} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all">Выйти</button>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-bold mb-6">Доступные курсы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <Link href={`/courses/${course.id}`} key={course.id}>
              <div className="bg-[#161b2c] p-8 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                <p className="text-white/60 line-clamp-2 leading-relaxed">{course.description}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-blue-500">
                  Перейти к обучению →
                </div>
              </div>
            </Link>
          ))}
          {courses.length === 0 && (
             <div className="col-span-full py-20 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-white/40">Курсы еще не добавлены</p>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
