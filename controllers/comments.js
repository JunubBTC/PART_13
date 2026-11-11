const router = require('express').Router()
const { Comment, Post, User } = require('../models')
const { userExtractor } = require('../middleware/auth')

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  const comments = await Comment.findAll({
    where: { postId: req.params.postId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }],
    order: [['created_at', 'DESC']]
  })

  res.json(comments)
})

// Create comment
router.post('/', userExtractor, async (req, res) => {
  const { content, postId } = req.body
  const userId = req.user.id

  // Check if post exists
  const post = await Post.findByPk(postId)
  if (!post) {
    return res.status(404).json({ error: 'post not found' })
  }

  const comment = await Comment.create({
    content,
    postId,
    userId
  })

  const createdComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }]
  })

  res.status(201).json(createdComment)
})

// Update comment
router.put('/:id', userExtractor, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  
  if (!comment) {
    return res.status(404).json({ error: 'comment not found' })
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  const { content } = req.body
  comment.content = content
  await comment.save()

  const updatedComment = await Comment.findByPk(comment.id, {
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }]
  })

  res.json(updatedComment)
})

// Delete comment
router.delete('/:id', userExtractor, async (req, res) => {
  const comment = await Comment.findByPk(req.params.id)
  
  if (!comment) {
    return res.status(404).json({ error: 'comment not found' })
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  await comment.destroy()
  res.status(204).end()
})

module.exports = router
