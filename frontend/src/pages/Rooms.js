import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSocket from '../hooks/useSocket';
import Modal from '../components/Modal';

const statusColors = {
  disponivel: 'bg-green-500',
  ocupado: 'bg-red-500',
  manutencao: 'bg-yellow-500',
};

const statusOptions = ['disponivel', 'ocupado', 'manutencao'];

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const roomUpdated = useSocket('roomUpdated');

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get('/api/rooms');
        setRooms(response.data);
      } catch (err) {
        setError('Erro ao carregar os quartos');
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  useEffect(() => {
    if (roomUpdated) {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomUpdated.id ? roomUpdated : room
        )
      );
    }
  }, [roomUpdated]);

  const openModal = (room) => {
    setSelectedRoom(room);
    setNewStatus(room.status);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedRoom(null);
  };

  const confirmStatusChange = async () => {
    try {
      await axios.put(\`/api/rooms/\${selectedRoom.id}\`, { status: newStatus });
      closeModal();
    } catch (err) {
      alert('Erro ao atualizar status do quarto');
    }
  };

  // Drag and Drop handlers
  const onDragStart = (e, roomId) => {
    e.dataTransfer.setData('roomId', roomId);
  };

  const onDrop = async (e, status) => {
    const roomId = e.dataTransfer.getData('roomId');
    const room = rooms.find((r) => r.id === parseInt(roomId));
    if (room && room.status !== status) {
      try {
        await axios.put(\`/api/rooms/\${room.id}\`, { status });
      } catch (err) {
        alert('Erro ao atualizar status do quarto');
      }
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  if (loading) return <p>Carregando quartos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestão de Quartos</h2>
      <div className="flex space-x-4">
        {statusOptions.map((status) => (
          <div
            key={status}
            onDrop={(e) => onDrop(e, status)}
            onDragOver={onDragOver}
            className={`flex-1 p-4 rounded shadow min-h-[300px] ${statusColors[status]}`}
          >
            <h3 className="text-xl font-semibold mb-4 text-white">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </h3>
            {rooms
              .filter((room) => room.status === status)
              .map((room) => (
                <div
                  key={room.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, room.id)}
                  className="p-4 mb-4 rounded bg-white text-black cursor-move shadow"
                  onClick={() => openModal(room)}
                >
                  <h4 className="font-semibold">Quarto {room.numero}</h4>
                  {room.observacoes && <p className="text-sm">{room.observacoes}</p>}
                </div>
              ))}
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        title={selectedRoom ? \`Alterar status do quarto \${selectedRoom.numero}\` : ''}
        onClose={closeModal}
        onConfirm={confirmStatusChange}
      >
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
}
