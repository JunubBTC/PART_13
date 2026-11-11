const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map(e => e.message) })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: 'username or email already exists' })
  }

  next(error)
}

module.exports = errorHandler
