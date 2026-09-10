'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiUrl } from '@/lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.ok) {
        alert('Registration successful!');
        router.push('/auth/login');
      } else {
        const data = await res.json();
        alert(data.detail || 'Registration failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0b1020', color: '#fff' }}>
      <form onSubmit={handleRegister} style={{ background: '#161b2c', padding: 32, borderRadius: 12, width: 320 }}>
        <h2 style={{ marginBottom: 24 }}>Регистрация</h2>
        <input type="text" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: 'none', background: '#fff', color: '#0b1020' }} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: 'none', background: '#fff', color: '#0b1020' }} required />
        <input type="password" placeholder="Пароль (минимум 8 символов)" value={password} onChange={e => setPassword(e.target.value)} minLength={8} style={{ width: '100%', padding: 10, marginBottom: 8, borderRadius: 6, border: 'none', background: '#fff', color: '#0b1020' }} required />
        <p style={{ fontSize: 12, opacity: 0.6, marginBottom: 24 }}>
          Регистрация создаёт аккаунт студента. Роль преподавателя назначает администратор.
        </p>
        <button type="submit" style={{ width: '100%', padding: 12, background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Зарегистрироваться</button>
      </form>
    </div>
  );
}
