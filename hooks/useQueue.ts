import { QUEUE_EVENTS } from '../shared/constants';
import { useEffect, useState } from 'react';
import { getSocket, joinQueueRoom} from '../lib/socket';
import { api } from '../lib/api';
import type { QueueState } from '../shared/types';

export const useQueue = (queueId: string) => {
    const [state, setState] = useState<QueueState | null>(null);
    const [loading , setLoading] = useState(true);

    useEffect(() => {
        if(!queueId) return;
        let active = true;
        setLoading(true);
        void api.get(`/queues/${queueId}/state`)
            .then((data) => {
                if (active) setState(data);
            })
            .catch(() => {
                if (active) setState(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        joinQueueRoom(queueId);
        const socket = getSocket();
         
          socket.on(QUEUE_EVENTS.QUEUE_UPDATED, (data: QueueState) => {
           setState(data); 
           setLoading(false);
        });
        return() =>{
            active = false;
            socket.off(QUEUE_EVENTS.QUEUE_UPDATED);
        }
    }, [queueId]);
    
    return { state, loading };
}
