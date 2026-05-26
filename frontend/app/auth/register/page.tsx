'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
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
        <input type="text" placeholder="Имя" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: 'none' }} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: 'none' }} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 6, border: 'none' }} required />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 10, marginBottom: 24, borderRadius: 6, border: 'none' }}>
          <option value="student">Студент</option>
          <option value="teacher">Преподаватель</option>
        </select>
        <button type="submit" style={{ width: '100%', padding: 12, background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Зарегистрироваться</button>
      </form>
    </div>
  );
}
