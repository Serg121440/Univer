'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth(data.access_token, data.role);
        router.push('/dashboard');
      } else {
        alert(data.detail || 'Login failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b1020] text-white">
      <form onSubmit={handleLogin} className="bg-[#161b2c] p-8 rounded-xl w-80 shadow-2xl border border-white/5">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в LMS</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-[#0b1020] border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-[#0b1020] border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          required
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
