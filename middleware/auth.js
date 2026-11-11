const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const { User } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(req.token, SECRET)
    
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findByPk(decodedToken.id)
    
    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }

    if (user.disabled) {
      return res.status(401).json({ error: 'account disabled' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ error: 'token invalid' })
  }
}

module.exports = { tokenExtractor, userExtractor }
