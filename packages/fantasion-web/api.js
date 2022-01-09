import fetch from 'cross-fetch'

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1'

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${apiUrl}${path}`, options)
  return await res.json()
}
