import fetch from 'cross-fetch'

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/v1'

export const TOKEN_COOKIE = 'authToken'
export const TOKEN_HEADER = 'X-Auth-Token'

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

const resolveHeaders = (options) => {
  const headers = options.headers || {}
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: resolveHeaders(options),
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
  return text ? JSON.parse(text) : null
}

export const curryAuth =
  (token) =>
  async (url, options = {}) => {
    let { headers } = options
    if (token) {
      headers = {
        ...headers,
        [TOKEN_HEADER]: token,
      }
    }
    return await apiFetch(url, {
      ...options,
      headers,
    })
  }
