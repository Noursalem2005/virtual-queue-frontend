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

const request = async (path: string, init?: RequestInit) => {
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
      }
    }

    return {
      error: fallbackError,
      data,
      status: res.status,
      ok: false,
    }
  }

  if (Array.isArray(data)) return data
  if (!isPlainObject(data)) return { ok: true, status: res.status }

  return {
    ...data,
    status: res.status,
    ok: true,
  }
}

export const api = {
  post: async (path: string, body: unknown, token?: string) =>
    request(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }),

  patch: async (path: string, body: unknown, token?: string) =>
    request(path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }),

  get: async (path: string, token?: string) =>
    request(path, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }),
}