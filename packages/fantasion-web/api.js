import fetch from 'cross-fetch'

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1'

export class ApiError extends Error {}
export class BadRequest extends ApiError {}
export class NotFound extends ApiError {}

const resolveApiErrorClass = (res) => {
  if (res.status === 404) {
    return NotFound
  }
  if (res.status === 400) {
    return BadRequest
  }
  return ApiError
}

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const text = await res.text()

  if (!res.ok) {
    const ErrorClass = resolveApiErrorClass(res)
    const error = new ErrorClass(text)
    try {
      error.body = JSON.parse(text)
    } catch (e) {
      error.body = {}
    }
    throw error
  }

  return JSON.parse(text)
}
