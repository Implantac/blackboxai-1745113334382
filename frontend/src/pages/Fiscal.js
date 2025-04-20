import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Fiscal() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await axios.get('/api/fiscal');
        setDocuments(response.data);
      } catch (err) {
        setError('Erro ao carregar documentos fiscais');
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  const handleExport = async (id) => {
    try {
      const response = await fetch(`/api/fiscal/export/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao exportar documento fiscal');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `documento_fiscal_${id}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erro ao exportar documento fiscal');
    }
  };

  if (loading) return <p>Carregando documentos fiscais...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Integração Fiscal</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Descrição</th>
            <th className="py-2 px-4 border-b">Data</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="text-center">
              <td className="py-2 px-4 border-b">{doc.id}</td>
              <td className="py-2 px-4 border-b">{doc.descricao || '-'}</td>
              <td className="py-2 px-4 border-b">{new Date(doc.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleExport(doc.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                >
                  Exportar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
