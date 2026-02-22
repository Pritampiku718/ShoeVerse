// frontend/src/hooks/useSocket.js
import { useEffect, useState } from 'react';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Skip socket connection in development if you don't need real-time
    if (import.meta.env.MODE === 'development') {
      console.log('Socket.io disabled in development mode');
      return;
    }

    // Only try to connect if you actually have socket.io set up
    try {
      const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Socket connection code here...
    } catch (error) {
      console.log('Socket.io not configured');
    }
  }, []);

  return { socket: null, isConnected: false, emit: () => {}, on: () => {}, off: () => {} };
};

export default useSocket;