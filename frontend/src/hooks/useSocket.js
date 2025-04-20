import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust URL as needed

export default function useSocket(eventName) {
  const [data, setData] = useState(null);

  useEffect(() => {
    socket.on(eventName, (payload) => {
      setData(payload);
    });

    return () => {
      socket.off(eventName);
    };
  }, [eventName]);

  return data;
}
