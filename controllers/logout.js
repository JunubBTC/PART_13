const router = require('express').Router()
const { Session } = require('../models')
const { userExtractor } = require('../middleware/auth')

// Exercise 25: Logout - remove session from database
router.delete('/', userExtractor, async (req, res) => {
  const token = req.token

  if (!token) {
    return res.status(401).json({ error: 'token missing' })
  }

  // Delete the session
  await Session.destroy({
    where: { token }
  })

  res.status(204).end()
})

module.exports = router
