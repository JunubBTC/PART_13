const router = require('express').Router()
const { Like, Post, User } = require('../models')
const { userExtractor } = require('../middleware/auth')

// Like a post
router.post('/', userExtractor, async (req, res) => {
  const { postId } = req.body
  const userId = req.user.id

  // Check if post exists
  const post = await Post.findByPk(postId)
  if (!post) {
    return res.status(404).json({ error: 'post not found' })
  }

  // Check if already liked
  const existingLike = await Like.findOne({
    where: { userId, postId }
  })

  if (existingLike) {
    return res.status(400).json({ error: 'post already liked' })
  }

  const like = await Like.create({ userId, postId })

  const createdLike = await Like.findByPk(like.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name']
    }]
  })

  res.status(201).json(createdLike)
})

// Unlike a post
router.delete('/:postId', userExtractor, async (req, res) => {
  const postId = req.params.postId
  const userId = req.user.id

  const like = await Like.findOne({
    where: { userId, postId }
  })

  if (!like) {
    return res.status(404).json({ error: 'like not found' })
  }

  await like.destroy()
  res.status(204).end()
})

// Get likes for a post
router.get('/post/:postId', async (req, res) => {
  const likes = await Like.findAll({
    where: { postId: req.params.postId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }]
  })

  res.json(likes)
})

module.exports = router
