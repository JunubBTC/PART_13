const router = require('express').Router()
const { Post, User, Like, Comment, Share } = require('../models')
const { userExtractor } = require('../middleware/auth')
const { Sequelize } = require('sequelize')

// Get all posts (Feed)
router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('likes.id'))), 'likesCount'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentsCount'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('shares.id'))), 'sharesCount']
      ]
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name', 'avatar']
      },
      {
        model: Like,
        as: 'likes',
        attributes: [],
      },
      {
        model: Comment,
        as: 'comments',
        attributes: [],
      },
      {
        model: Share,
        as: 'shares',
        attributes: [],
      }
    ],
    group: ['post.id', 'user.id'],
    order: [['created_at', 'DESC']]
  })

  res.json(posts)
})

// Get single post with full details
router.get('/:id', async (req, res) => {
  const post = await Post.findByPk(req.params.id, {
    attributes: {
      include: [
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('likes.id'))), 'likesCount'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('comments.id'))), 'commentsCount'],
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('shares.id'))), 'sharesCount']
      ]
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name', 'avatar']
      },
      {
        model: Like,
        as: 'likes',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'name']
        }]
      },
      {
        model: Comment,
        as: 'comments',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'name', 'avatar']
        }],
        order: [['created_at', 'DESC']]
      },
      {
        model: Share,
        as: 'shares',
        attributes: [],
      }
    ],
    group: ['post.id', 'user.id', 'likes.id', 'likes->user.id', 'comments.id', 'comments->user.id']
  })

  if (post) {
    res.json(post)
  } else {
    res.status(404).json({ error: 'post not found' })
  }
})

// Create new post
router.post('/', userExtractor, async (req, res) => {
  const { content, imageUrl } = req.body
  const user = req.user

  const post = await Post.create({
    content,
    imageUrl,
    userId: user.id
  })

  const createdPost = await Post.findByPk(post.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }]
  })

  res.status(201).json(createdPost)
})

// Update post
router.put('/:id', userExtractor, async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  
  if (!post) {
    return res.status(404).json({ error: 'post not found' })
  }

  if (post.userId !== req.user.id) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  const { content, imageUrl } = req.body
  
  if (content) post.content = content
  if (imageUrl !== undefined) post.imageUrl = imageUrl

  await post.save()
  
  const updatedPost = await Post.findByPk(post.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }]
  })

  res.json(updatedPost)
})

// Delete post
router.delete('/:id', userExtractor, async (req, res) => {
  const post = await Post.findByPk(req.params.id)
  
  if (!post) {
    return res.status(404).json({ error: 'post not found' })
  }

  if (post.userId !== req.user.id) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  await post.destroy()
  res.status(204).end()
})

module.exports = router
