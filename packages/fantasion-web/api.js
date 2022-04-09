import fetch from 'cross-fetch'
import getConfig from 'next/config'

import { resolveApiErrorClass } from './errors'

const { publicRuntimeConfig } = getConfig()
const { apiUrl } = publicRuntimeConfig

export const TOKEN_COOKIE = 'authToken'
export const TOKEN_HEADER = 'Authorization'

const resolveHeaders = (options) => {
  const headers = options.headers || {}
  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

const resolveBody = (options) =>
  options.body ? JSON.stringify(options.body) : undefined

export const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    body: resolveBody(options),
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

const withMethod =
  (cb, method) =>
  async (url, options = {}) =>
    await cb(url, {
      ...options,
      method,
    })

const getFetch = (token) => {
  if (!token) {
    return apiFetch
  }
  const authorizedFetch = (url, options = {}) =>
    apiFetch(url, {
      ...options,
      headers: {
        ...options.headers,
        [TOKEN_HEADER]: `Token ${token}`,
      },
    })
  authorizedFetch.authorized = true
  return authorizedFetch
}

export const curryAuth = (token) => {
  const fetch = getFetch(token)
  fetch.delete = withMethod(fetch, 'DELETE')
  fetch.patch = withMethod(fetch, 'PATCH')
  fetch.post = withMethod(fetch, 'POST')
  fetch.put = withMethod(fetch, 'PUT')
  return fetch
}
