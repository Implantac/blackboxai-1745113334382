import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import useSocket from '../hooks/useSocket';

export default function Minibar() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(''); // 'consume' or 'restock'
  const [restockQuantity, setRestockQuantity] = useState(1);

  const minibarUpdated = useSocket('minibarUpdated');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('/api/minibar');
        setProducts(response.data);
      } catch (err) {
        setError('Erro ao carregar os produtos do minibar');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (minibarUpdated) {
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === minibarUpdated.id ? minibarUpdated : prod
        )
      );
    }
  }, [minibarUpdated]);

  const openModal = (product, type) => {
    setSelectedProduct(product);
    setActionType(type);
    setRestockQuantity(1);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setActionType('');
  };

  const confirmAction = async () => {
    try {
      if (actionType === 'consume') {
        await axios.post(`/api/minibar/consume/${selectedProduct.id}/${selectedProduct.id}`);
        alert(`Consumo do produto ${selectedProduct.nome} registrado.`);
      } else if (actionType === 'restock') {
        await axios.post(`/api/minibar/restock/${selectedProduct.id}`, { quantity: restockQuantity });
        alert(`Reposição de ${restockQuantity} unidades do produto ${selectedProduct.nome} registrada.`);
      }
      closeModal();
    } catch (err) {
      alert('Erro ao processar a ação');
    }
  };

  if (loading) return <p>Carregando produtos do minibar...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Controle de Minibar</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Produto</th>
            <th className="py-2 px-4 border-b">Estoque</th>
            <th className="py-2 px-4 border-b">Preço</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="text-center">
              <td className="py-2 px-4 border-b">{prod.nome}</td>
              <td className="py-2 px-4 border-b">{prod.estoque}</td>
              <td className="py-2 px-4 border-b">R$ {prod.preco.toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal(prod, 'consume')}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600 transition"
                >
                  Consumir
                </button>
                <button
                  onClick={() => openModal(prod, 'restock')}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                >
                  Repor
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalOpen}
        title={actionType === 'consume' ? 'Confirmar consumo' : 'Confirmar reposição'}
        onClose={closeModal}
        onConfirm={confirmAction}
      >
        {actionType === 'consume' ? (
          <p>Deseja registrar o consumo do produto {selectedProduct?.nome}?</p>
        ) : (
          <div>
            <p>Informe a quantidade para reposição do produto {selectedProduct?.nome}:</p>
            <input
              type="number"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(parseInt(e.target.value, 10))}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
