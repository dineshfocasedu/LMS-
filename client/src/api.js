const BASE = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api'

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  return data
}

export const api = {
  getProducts: () => request('GET', '/purchase/products'),
  createOrder: (payload) => request('POST', '/purchase/create-order', payload),
  verifyPayment: (payload) => request('POST', '/purchase/verify', payload),
}