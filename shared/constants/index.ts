export const QUEUE_EVENTS = {
    TICKET_JOINED: 'ticket:joined',
    TICKET_CALLED: 'ticket:called',
    TICKET_SERVED: 'ticket:served',
    QUEUE_UPDATED: 'queue:updated',
    POSITION_UPDATE: 'position:update',
} as const;

export const BUSINESS_CATEGORIES = [
    'bank',
    'hospital',
    'clinic',
    'government',
    'telecom',
    'cafe',
    'restaurant',
    'pharmacy',
    'other',
] as const;

export const PRIORITY_REASONS = [
    'elderly',
    'pregnant',
    'disability',
    'emergency',
    'vip',
] as const;
