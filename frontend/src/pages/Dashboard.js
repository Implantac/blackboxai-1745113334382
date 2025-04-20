import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [cashFlow, setCashFlow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCashFlow() {
      try {
        const response = await axios.get('/api/financial/cashflow');
        setCashFlow(response.data);
      } catch (err) {
        setError('Erro ao carregar o resumo financeiro');
      } finally {
        setLoading(false);
      }
    }
    fetchCashFlow();
  }, []);

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Receitas Totais</h2>
          <p className="text-green-600 text-2xl">R$ {cashFlow.totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Despesas Totais</h2>
          <p className="text-red-600 text-2xl">R$ {cashFlow.totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Saldo</h2>
          <p className={`text-2xl ${cashFlow.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {cashFlow.balance.toFixed(2)}
          </p>
        </div>
      </section>
    </div>
  );
}
