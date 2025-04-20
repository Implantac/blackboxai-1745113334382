import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

export default function Financial() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cashFlow, setCashFlow] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transRes, cashRes] = await Promise.all([
          axios.get('/api/financial/transactions'),
          axios.get('/api/financial/cashflow'),
        ]);
        setTransactions(transRes.data);
        setCashFlow(cashRes.data);
      } catch (err) {
        setError('Erro ao carregar dados financeiros');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/financial/transactions/${selectedTransaction.id}`);
      setTransactions((prev) => prev.filter((tx) => tx.id !== selectedTransaction.id));
      closeModal();
    } catch (err) {
      alert('Erro ao deletar transação');
    }
  };

  if (loading) return <p>Carregando dados financeiros...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Módulo Financeiro</h2>
      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Resumo do Fluxo de Caixa</h3>
        {cashFlow ? (
          <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(cashFlow, null, 2)}</pre>
        ) : (
          <p>Resumo não disponível</p>
        )}
      </section>
      <section>
        <h3 className="text-xl font-semibold mb-2">Transações</h3>
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Descrição</th>
              <th className="py-2 px-4 border-b">Valor</th>
              <th className="py-2 px-4 border-b">Data</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="text-center">
                <td className="py-2 px-4 border-b">{tx.id}</td>
                <td className="py-2 px-4 border-b">{tx.descricao || '-'}</td>
                <td className="py-2 px-4 border-b">R$ {tx.valor?.toFixed(2) || '0.00'}</td>
                <td className="py-2 px-4 border-b">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(tx)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        isOpen={modalOpen}
        title="Confirmar exclusão"
        onClose={closeModal}
        onConfirm={confirmDelete}
      >
        <p>Tem certeza que deseja deletar esta transação?</p>
      </Modal>
    </div>
  );
}
