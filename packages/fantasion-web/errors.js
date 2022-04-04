class ServerError extends Error {}
class BadRequest extends ServerError {}
class Forbidden extends ServerError {}
class NotFound extends ServerError {}
class Unauthorized extends ServerError {}
class InternalServerError extends ServerError {}

const resolveApiErrorClass = (res) => {
  if (res.status === 401) {
    return Unauthorized
  }
  if (res.status === 403) {
    return Forbidden
  }
  if (res.status === 404) {
    return NotFound
  }
  if (res.status === 400) {
    return BadRequest
  }
  return InternalServerError
}

module.exports = {
  BadRequest,
  Forbidden,
  InternalServerError,
  NotFound,
  ServerError,
  Unauthorized,
  resolveApiErrorClass,
}
