'use client';
import { API_URL } from "@/store/config";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from "@/store/authStore";
import { getUserIdFromToken } from "@/store/utils";

export default function LessonPage() {
  const { id, lessonId } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const { token } = useAuthStore();

  const handleSubmitHomework = async () => {
    const userId = getUserIdFromToken(token);
    if (!userId) {
      alert("Please login first");
      return;
    }

    const res = await fetch(API_URL + '/homework', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ student_id: userId, lesson_id: parseInt(lessonId as string) }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      alert(data.detail || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-10">
      <h1 className="text-3xl font-bold">Урок {lessonId}</h1>

      <div className="bg-[#161b2c] p-10 rounded-2xl border border-white/5 mt-8 max-w-4xl">
        <p className="text-white/60 mb-8">Материалы урока загружаются из Google Drive...</p>

        <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-white/10 mb-10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-white/40 font-mono tracking-tighter text-xl">[ VIDEO PLAYER ]</span>
        </div>

        <div className="border-t border-white/10 pt-10">
            <h3 className="text-xl font-bold mb-4">Домашнее задание</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              Выполните расчет unit-экономики для нового товара и прикрепите ссылку на таблицу.
              Ваш преподаватель проверит работу в течение 24 часов.
            </p>

            {submitted ? (
                <div className="flex items-center gap-3 bg-green-500/10 text-green-400 p-4 rounded-lg border border-green-500/20">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="font-medium">Работа успешно отправлена на проверку</span>
                </div>
            ) : (
                <button
                  onClick={handleSubmitHomework}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  Сдать работу
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
