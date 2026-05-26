'use client';

export default function Simulators() {
  return (
    <div style={{ padding: 40, background: '#0b1020', minHeight: '100vh', color: '#fff' }}>
      <h1>Тренажеры маркетплейсов</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32 }}>
        <div style={{ background: '#161b2c', padding: 32, borderRadius: 12, textAlign: 'center' }}>
            <h3>Симулятор рекламы</h3>
            <p style={{ opacity: 0.6, fontSize: 14 }}>Настройка АРК и управление ставками</p>
            <button style={{ marginTop: 20, padding: '8px 16px', border: '1px solid #3b82f6', borderRadius: 4, background: 'transparent', color: '#3b82f6' }}>Запустить</button>
        </div>
        <div style={{ background: '#161b2c', padding: 32, borderRadius: 12, textAlign: 'center' }}>
            <h3>Симулятор поставок</h3>
            <p style={{ opacity: 0.6, fontSize: 14 }}>Распределение по складам (FBO)</p>
            <button style={{ marginTop: 20, padding: '8px 16px', border: '1px solid #3b82f6', borderRadius: 4, background: 'transparent', color: '#3b82f6' }}>Запустить</button>
        </div>
        <div style={{ background: '#161b2c', padding: 32, borderRadius: 12, textAlign: 'center' }}>
            <h3>Симулятор аналитики</h3>
            <p style={{ opacity: 0.6, fontSize: 14 }}>Работа с дашбордами и метриками</p>
            <button style={{ marginTop: 20, padding: '8px 16px', border: '1px solid #3b82f6', borderRadius: 4, background: 'transparent', color: '#3b82f6' }}>Запустить</button>
        </div>
      </div>
    </div>
  );
}
