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
    // Exercise 7 & 9: Better error messages
    const messages = error.errors.map(e => e.message)
    return res.status(400).json({ error: messages })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    // Exercise 9: Better validation messages
    const messages = error.errors.map(e => {
      if (e.path === 'username' || e.path === 'email') {
        return 'username must be a valid email address'
      }
      return e.message
    })
    return res.status(400).json({ error: messages })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = errorHandler
