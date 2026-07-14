module.exports = function errorHandler(err, _req, res, _next) {
  const isDev = process.env.NODE_ENV !== 'production'
  const status  = err.statusCode || err.status || 500
  const message = err.message || 'Internal server error'

  const body = { status: 'error', message, code: status }
  if (isDev) body.stack = err.stack

  res.status(status).json(body)
}
