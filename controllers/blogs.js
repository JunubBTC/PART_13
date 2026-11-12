const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { userExtractor } = require('../middleware/auth')

// Middleware to find blog by id
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  next()
}

// Exercise 13 & 14: Get all blogs with search and ordering (Exercise 15)
router.get('/', async (req, res) => {
  const where = {}

  // Exercise 13 & 14: Search in title or author
  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name']
    },
    where,
    order: [['likes', 'DESC']] // Exercise 15: Order by likes descending
  })

  res.json(blogs)
})

// Get single blog
router.get('/:id', blogFinder, async (req, res) => {
  res.json(req.blog)
})

// Exercise 10: Create blog (requires authentication)
// Exercise 19: Added year field with validation
router.post('/', userExtractor, async (req, res) => {
  const { author, url, title, likes, year } = req.body
  const user = req.user

  const blog = await Blog.create({
    author,
    url,
    title,
    likes: likes || 0,
    year,
    userId: user.id
  })

  const createdBlog = await Blog.findByPk(blog.id, {
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name']
    }
  })

  res.status(201).json(createdBlog)
})

// Exercise 6: Update blog likes (or other fields)
// Exercise 19: Added year field with validation
router.put('/:id', blogFinder, async (req, res) => {
  const { likes, author, url, title, year } = req.body

  if (likes !== undefined) {
    req.blog.likes = likes
  }
  if (author !== undefined) {
    req.blog.author = author
  }
  if (url !== undefined) {
    req.blog.url = url
  }
  if (title !== undefined) {
    req.blog.title = title
  }
  if (year !== undefined) {
    req.blog.year = year
  }

  await req.blog.save()

  const updatedBlog = await Blog.findByPk(req.blog.id, {
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name']
    }
  })

  res.json(updatedBlog)
})

// Exercise 11: Delete blog (only by owner)
router.delete('/:id', blogFinder, userExtractor, async (req, res) => {
  if (req.blog.userId !== req.user.id) {
    return res.status(403).json({ error: 'only the creator can delete a blog' })
  }

  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router
