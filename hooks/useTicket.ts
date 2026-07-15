import { useEffect, useState } from 'react';
import{ getSocket , joinTicketRoom} from '../lib/socket';
import { QUEUE_EVENTS } from '../shared/constants';

export const useTicket = (ticketId: string) => {
    const [called , setCalled] = useState(false);
    useEffect(() => {
        if(!ticketId) return;
        joinTicketRoom(ticketId);

        const socket = getSocket();
        socket.on(QUEUE_EVENTS.TICKET_CALLED, () => {
            setCalled(true);
        });
        return() => {
            socket.off(QUEUE_EVENTS.TICKET_CALLED);
        }
    }, [ticketId]);
    return { called };
}