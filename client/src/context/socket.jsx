import React from 'react';
import socketClient from 'socket.io-client';

export const socket = socketClient(process.env.REACT_APP_SOCKET_SERVER);
export const SocketContext = React.createContext();
