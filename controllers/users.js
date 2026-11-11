const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Post } = require('../models')

// Get all users
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Post,
        as: 'posts',
        attributes: ['id', 'content', 'createdAt']
      }
    ]
  })
  res.json(users)
})

// Get single user
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [
      {
        model: Post,
        as: 'posts',
        attributes: ['id', 'content', 'imageUrl', 'createdAt']
      }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' })
  }
})

// Create new user (Register)
router.post('/', async (req, res) => {
  const { username, name, email, password } = req.body

  if (!password || password.length < 3) {
    return res.status(400).json({ 
      error: 'password must be at least 3 characters long' 
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    email,
    passwordHash
  })

  res.status(201).json(user)
})

// Update user
router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const { name, bio, avatar } = req.body
  
  if (name) user.name = name
  if (bio !== undefined) user.bio = bio
  if (avatar) user.avatar = avatar

  await user.save()
  res.json(user)
})

module.exports = router
