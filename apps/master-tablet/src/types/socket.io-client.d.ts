// src/types/socket.io-client.d.ts

declare module 'socket.io-client' {
  export interface Socket {
    on(msgKey: string, cb: () => void);
    emit(msgKey: string, data: Record<never, never>);
    connected: boolean;
    disconnected: boolean;
  }
  export interface SocketOptions {
    transports?: string[];
  }

  export default function io(url: string, options?: SocketOptions): Socket;
}
