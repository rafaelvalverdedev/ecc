import { getToken, logout } from './authService'

export async function apiFetch(url, options = {}) {
  const token = getToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (response.status === 401 || response.status === 403) {
    logout()

    // força reload para resetar contexto e rotas
    window.location.href = '/'
    return
  }

  return response
}
