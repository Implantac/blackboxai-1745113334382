import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        setError('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/users/${selectedUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      closeModal();
    } catch (err) {
      alert('Erro ao deletar usuário');
    }
  };

  if (loading) return <p>Carregando usuários...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Painel de Usuários</h2>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Função</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="py-2 px-4 border-b">{user.id}</td>
              <td className="py-2 px-4 border-b">{user.nome || user.username || '-'}</td>
              <td className="py-2 px-4 border-b">{user.email || '-'}</td>
              <td className="py-2 px-4 border-b">{user.role || '-'}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => openModal(user)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={modalOpen}
        title="Confirmar exclusão"
        onClose={closeModal}
        onConfirm={confirmDelete}
      >
        <p>Tem certeza que deseja deletar este usuário?</p>
      </Modal>
    </div>
  );
}
