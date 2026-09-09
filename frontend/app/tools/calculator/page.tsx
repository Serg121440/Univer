'use client';
import { useState } from 'react';
import { apiUrl } from '@/lib/api';

export default function Calculator() {
  const [form, setForm] = useState({
    price: 1000, cost: 400, vat_rate: 0.07, marketplace_commission: 0.15,
    logistics_cost: 50, storage_cost: 20, marketing_cost: 100
  });
  const [result, setResult] = useState<any>(null);

  const calculate = async () => {
    const res = await fetch(apiUrl('/tools/calculator'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white p-10">
      <h1 className="text-3xl font-bold mb-10">Unit Economics Calculator 2026</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#161b2c] p-8 rounded-2xl border border-white/5 space-y-4">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs uppercase tracking-wider text-white/40 mb-1">{key.replace('_', ' ')}</label>
              <input
                type="number"
                value={value}
                onChange={e => setForm({...form, [key]: parseFloat(e.target.value)})}
                className="w-full bg-[#0b1020] border border-white/10 rounded-lg p-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          ))}
          <button
            onClick={calculate}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 mt-4"
          >
            Рассчитать прибыль
          </button>
        </div>

        <div className="space-y-6">
          {result ? (
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-10 rounded-3xl border border-white/10 backdrop-blur-xl">
              <div className="mb-8 text-center">
                <p className="text-white/60 text-sm mb-1 uppercase tracking-widest">Итоговая прибыль</p>
                <h2 className="text-6xl font-black text-white">{result.profit} ₽</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-white/40 text-xs mb-1">Маржа</p>
                  <p className="text-xl font-bold">{result.margin}%</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-white/40 text-xs mb-1">ROI</p>
                  <p className="text-xl font-bold text-green-400">{result.roi}%</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Налоги (НДС)</span>
                  <span>{result.vat_amount} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Комиссия МП</span>
                  <span>{result.commission_amount} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Эквайринг</span>
                  <span>{result.acquiring_cost} ₽</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
               <p className="text-white/20 italic">Введите данные для расчета</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
