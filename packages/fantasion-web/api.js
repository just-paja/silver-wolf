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

const memoCache = []

const memo = (fn) => (firstArg) => {
  if (memoCache[0] === firstArg) {
    return memoCache[1]
  }
  const result = fn(firstArg)
  memoCache[0] = firstArg
  memoCache[1] = result
  return result
}

const parseCookies = memo((cookies) =>
  cookies
    .split(';')
    .map((item) => item.split('='))
    .reduce((aggr, [key, value]) => Object.assign(aggr, { [key]: value }), {})
)

const getAuthToken = () =>
  parseCookies(global?.document?.cookie || '').authToken

const resolveHeaders = (options) => {
  const headers = options.headers || {}
  const authToken = getAuthToken()
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }
  if (authToken) {
    headers['X-Auth-Token'] = authToken
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

  return JSON.parse(text)
}
