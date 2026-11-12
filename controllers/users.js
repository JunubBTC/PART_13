const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Post, Blog } = require('../models')

// Exercise 8 & 12: Get all users with their blogs
router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: [
      {
        model: Post,
        as: 'posts',
        attributes: ['id', 'content', 'createdAt']
      },
      {
        model: Blog,
        as: 'blogs',
        attributes: { exclude: ['userId'] }
      }
    ]
  })
  res.json(users)
})

// Exercise 8 & 12: Get single user with blogs
router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash'] },
    include: [
      {
        model: Post,
        as: 'posts',
        attributes: ['id', 'content', 'imageUrl', 'createdAt']
      },
      {
        model: Blog,
        as: 'blogs',
        attributes: { exclude: ['userId'] }
      }
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' })
  }
})

// Exercise 8 & 9: Create new user with email validation
router.post('/', async (req, res) => {
  const { username, name, email, password } = req.body

  // Exercise 9: Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(username)) {
    return res.status(400).json({ 
      error: ['username must be a valid email address']
    })
  }

  if (!password || password.length < 3) {
    return res.status(400).json({ 
      error: ['password must be at least 3 characters long'] 
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = await User.create({
    username,
    name,
    email: username, // Use username as email
    passwordHash
  })

  res.status(201).json(user)
})

// Exercise 8: Update user (by username)
router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username }
  })
  
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const { name, bio, avatar } = req.body
  
  if (name) user.name = name
  if (bio !== undefined) user.bio = bio
  if (avatar) user.avatar = avatar

  await user.save()
  
  const updatedUser = await User.findByPk(user.id, {
    attributes: { exclude: ['passwordHash'] }
  })
  
  res.json(updatedUser)
})

module.exports = router
