'use client';
import { useState } from 'react';

export default function SEOChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    const res = await fetch('http://localhost:8000/tools/seo-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ padding: 40, background: '#0b1020', minHeight: '100vh', color: '#fff' }}>
      <h1>AI SEO Checker 2026</h1>
      <textarea
        style={{ width: '100%', height: 200, background: '#161b2c', border: 'none', borderRadius: 12, padding: 20, color: '#fff', marginTop: 24 }}
        placeholder="Введите описание товара для анализа..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={handleCheck} style={{ marginTop: 16, padding: '12px 24px', background: '#3b82f6', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer' }}>
        Анализировать
      </button>

      {result && (
        <div style={{ marginTop: 32, background: '#161b2c', padding: 24, borderRadius: 12 }}>
          <h3>Результат: {result.score}%</h3>
          <p><strong>Рекомендации:</strong> {result.recommendations}</p>
          <p><strong>Найденные ключи:</strong> {result.found_keywords.join(', ')}</p>
        </div>
      )}
    </div>
  );
}
