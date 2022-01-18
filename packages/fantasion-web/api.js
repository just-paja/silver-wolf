import fetch from 'cross-fetch'

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1'

export class ApiError extends Error {}
export class NotFound extends ApiError {}

const resolveApiErrorClass = (res) => {
  if (res.status === 404) {
    return NotFound
  }
  return ApiError
}

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${apiUrl}${path}`, options)
  const text = await res.text()

  if (!res.ok) {
    const ErrorClass = resolveApiErrorClass(res)
    throw new ErrorClass(text)
  }

  return JSON.parse(text)
}
