const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Session } = require('../models')
const { SECRET } = require('../utils/config')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.scope('withPassword').findOne({
    where: { username }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '7d' })

  // Exercise 25: Store session in database
  await Session.create({
    userId: user.id,
    token
  })

  res.status(200).json({
    token,
    username: user.username,
    name: user.name,
    id: user.id,
    avatar: user.avatar,
    bio: user.bio
  })
})

module.exports = router
