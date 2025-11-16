// src/context/useSocket.jsx
import { useContext } from 'react';
import { SocketContext } from './SocketContext.jsx';

// FIX: Tách hook ra file riêng để tương thích HMR (Fast Refresh)
export const useSocket = () => useContext(SocketContext);