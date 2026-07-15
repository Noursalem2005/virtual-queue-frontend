'use client';

import { useState } from "react";
import { useLang } from "../../components/providers/LangProvider";

type Ticket = {
    ticket_number: string | number;
};

export default function JoinQueue(){
    const { t, dir } = useLang();
    const [queueId, setQueueId] = useState('');
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(false);
    const handleJoin = async () => {
        setLoading(true);
        const token = localStorage.getItem('token') || '';
        const data = await fetch(`/queues/${queueId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ customerId: 'guest' })
        });
        const ticketData: Ticket = await data.json();
        setTicket(ticketData);
        setLoading(false);
    }
    if(ticket){
        return (
            <main dir={dir} className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
                <div className="border rounded-2xl p-10 text-center shadow-sm max-w-sm w-full">
                    <p className="text-gray-500 mb-2">{t.ticket.your}</p>
                    <h2 className="text-7xl font-bold mb-4">#{ticket.ticket_number}</h2>
                    <p className="text-gray-500">{t.join.subtitle}</p>
                </div>
            </main>
        )
    
    }
    return (
        <main dir={dir} className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
            <h1 className="text-2xl font-bold">{t.join.title}</h1>
            <input className=" border rounded-lg px-4 py-3 w-full max-w-sm"
            placeholder={t.join.placeholder}
            value={queueId}
            onChange={(e) => setQueueId(e.target.value)}
            />
            <button className="bg-black text-white px-8 py-3 rounded-lg disabled:opacity-50"
            onClick={handleJoin}
            disabled={loading || !queueId}
            >
                {loading ? t.join.joining : t.join.button}
            </button>
        </main>
    )

}