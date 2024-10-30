import io, { type Socket, type SocketOptions } from 'socket.io-client';

let socket: Socket;
export function useSocket() {
  const url = import.meta.env.VITE_SOCKET_URL;
  const options: SocketOptions = {
    transports: ['websocket'],
  };
  if (!socket) {
    socket = io(url, options);
  }

  socket.on('connect', () => {
    console.log(socket.connected);
  });

  socket.on('disconnect', () => {
    console.log(socket.disconnected);
  });

  return socket;
}
