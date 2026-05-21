const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export function getToken() {
  return localStorage.getItem('cesizen_token')
}

export function buildHeaders(extraHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request(method, path, body = null) {
  const options = {
    method,
    headers: buildHeaders(),
  }
  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${path}`, options)

  if (response.status === 401) {
    localStorage.removeItem('cesizen_token')
    window.location.href = '/auth/connexion'
    throw new Error('Non authentifié')
  }

  if (response.status === 403) {
    window.location.href = '/erreur?code=403'
    throw new Error('Accès interdit')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Erreur serveur')
  }

  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
}
