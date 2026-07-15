export type UserRole = 'business' | 'customer' | 'admin'

export interface User {
    id: string
    email: string
    role: UserRole
    createdAt: Date
}

export interface Business {
    id: string
    userId: string
    name: string
    type: string
    category: string
    phone: string
    address: string
    city: string
    logoUrl?: string
    isApproved: boolean
    isPublic: boolean
}

export interface Queue {
    id: string
    businessId: string
    name: string
    serviceType: string
    description?: string
    category?: string
    isActive: boolean
    isPublic: boolean
    currentNumber: number
    averageServiceMinutes: number
    createdAt: Date
}

export interface Ticket {
    id: string
    queue_id: string
    customer_id?: string
    customer_name?: string
    customer_phone?: string
    ticket_number: number
    status: 'waiting' | 'called' | 'served' | 'cancelled'
    priority: boolean
    priority_reason?: string
    joined_at: Date
    updated_at: Date
}

export interface Appointment {
    id: string
    queueId: string
    customerId?: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    scheduledAt: Date
    durationMinutes: number
    status: 'scheduled' | 'arrived' | 'served' | 'cancelled' | 'noshow'
    ticketNumber?: number
}

export interface QueueState {
    queueId: string
    waitingCount: number
    tickets: Ticket[]
    appointments: Appointment[]
    currentlyServing: Ticket | null
    averageWaitSeconds: number
    estimatedWaitForNext: number
}
