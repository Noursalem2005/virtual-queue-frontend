import { io , Socket } from 'socket.io-client';

let socket: Socket | null = null;


export const getSocket = () : Socket => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002', {
        autoConnect: false,
        });
    }
    return socket;
}

export const joinQueueRoom = (queueId: string ) => {
    const s = getSocket();
    if(!s.connected) s.connect();
    s.emit('join:queue', queueId);
}
export const joinTicketRoom = (ticketId: string ) => {
    const s = getSocket();
    if(!s.connected) s.connect();
    s.emit('join:ticket', ticketId);
}
