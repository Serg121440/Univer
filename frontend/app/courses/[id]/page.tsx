'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [modules, setModules] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/courses/modules`)
      .then(res => res.json())
      .then(data => {
        setModules(data.filter((m: any) => m.course_id === parseInt(id as string)));
      });
  }, [id]);

  return (
    <div style={{ padding: 40, background: '#0b1020', minHeight: '100vh', color: '#fff' }}>
      <h1>Содержание курса</h1>
      <div style={{ marginTop: 40 }}>
        {modules.map((module: any) => (
          <div key={module.id} style={{ background: '#161b2c', padding: 24, borderRadius: 12, marginBottom: 16 }}>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <div style={{ marginTop: 12 }}>
                <Link href={`/courses/${id}/lessons/1`} style={{ color: '#3b82f6' }}>Перейти к урокам →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
