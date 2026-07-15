const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

const parseJsonSafely = async (res: Response): Promise<unknown> => {
  try {
    return await res.json()
  } catch {
    return null
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const request = async <T = any>(path: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE}${path}`, init)
  const data = await parseJsonSafely(res)

  if (!res.ok) {
    const fallbackError = `Request failed (${res.status})`
    if (isPlainObject(data)) {
      return {
        ...data,
        error:
          (typeof data.error === 'string' && data.error) ||
          (typeof data.message === 'string' && data.message) ||
          fallbackError,
        status: res.status,
        ok: false,
      } as T
    }

    return {
      error: fallbackError,
      data,
      status: res.status,
      ok: false,
    } as T
  }

  if (Array.isArray(data)) return data as T
  if (!isPlainObject(data)) return { ok: true, status: res.status } as T

  return {
    ...data,
    status: res.status,
    ok: true,
  } as T
}

export const api = {
  post: async <T = any>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }),

  patch: async <T = any>(path: string, body: unknown, token?: string) =>
    request<T>(path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }),

  get: async <T = any>(path: string, token?: string) =>
    request<T>(path, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }),
}
