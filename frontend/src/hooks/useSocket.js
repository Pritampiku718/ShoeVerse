import { useEffect, useState } from 'react';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.log('Socket.io disabled in development mode');
      return;
    }
    try {
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    } catch (error) {
      console.log('Socket.io not configured');
    }
  }, []);

  return { socket: null, isConnected: false, emit: () => {}, on: () => {}, off: () => {} };
};

export default useSocket;