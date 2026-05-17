const features = [
  'Авторизация: email/password + JWT + role-based UX',
  'Управление курсами, модулями и уроками',
  'Домашние задания: отправка и проверка',
  'Подготовка интеграции Google Drive Sync',
  'Контур для AI SEO Checker и Unit Economics 2026',
];

export default function Home() {
  return (
    <main style={{ padding: 32, fontFamily: 'Inter, sans-serif', background: '#0b1020', minHeight: '100vh', color: '#f6f7fb' }}>
      <h1 style={{ fontSize: 36, marginBottom: 8 }}>LMS «Управляющий маркетплейсами 2026»</h1>
      <p style={{ opacity: 0.85, marginBottom: 24 }}>Рабочий MVP: backend API + DB-модели + Docker-инфраструктура.</p>
      <section style={{ display: 'grid', gap: 12, maxWidth: 900 }}>
        {features.map((item) => (
          <article key={item} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
            {item}
          </article>
        ))}
      </section>
      <p style={{ marginTop: 28, opacity: 0.7 }}>
        API docs: <code>http://localhost:8000/docs</code>
      </p>
    </main>
  );
}
