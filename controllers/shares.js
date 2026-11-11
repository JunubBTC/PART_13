const router = require('express').Router()
const { Share, Post, User } = require('../models')
const { userExtractor } = require('../middleware/auth')

// Share a post
router.post('/', userExtractor, async (req, res) => {
  const { postId, caption } = req.body
  const userId = req.user.id

  // Check if post exists
  const post = await Post.findByPk(postId)
  if (!post) {
    return res.status(404).json({ error: 'post not found' })
  }

  const share = await Share.create({
    userId,
    postId,
    caption
  })

  const createdShare = await Share.findByPk(share.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'name', 'avatar']
      },
      {
        model: Post,
        as: 'post',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'name']
        }]
      }
    ]
  })

  res.status(201).json(createdShare)
})

// Get shares for a post
router.get('/post/:postId', async (req, res) => {
  const shares = await Share.findAll({
    where: { postId: req.params.postId },
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'username', 'name', 'avatar']
    }],
    order: [['created_at', 'DESC']]
  })

  res.json(shares)
})

// Delete share
router.delete('/:id', userExtractor, async (req, res) => {
  const share = await Share.findByPk(req.params.id)
  
  if (!share) {
    return res.status(404).json({ error: 'share not found' })
  }

  if (share.userId !== req.user.id) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  await share.destroy()
  res.status(204).end()
})

module.exports = router
