import React, { useState } from 'react';
import axios from 'axios';

export default function TEFPayment() {
  const [form, setForm] = useState({
    amount: '',
    cardNumber: '',
    cardHolder: '',
    expiration: '',
    cvv: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('/api/financial/tef/payment', form);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro no pagamento TEF');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Pagamento TEF</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Valor (R$)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Número do Cartão</label>
          <input
            type="text"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            required
            maxLength={16}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Nome do Titular</label>
          <input
            type="text"
            name="cardHolder"
            value={form.cardHolder}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1">Validade (MM/AA)</label>
            <input
              type="text"
              name="expiration"
              value={form.expiration}
              onChange={handleChange}
              required
              maxLength={5}
              placeholder="MM/AA"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              required
              maxLength={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Pagar
        </button>
      </form>
    </div>
  );
}
