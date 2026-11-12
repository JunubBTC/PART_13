const router = require('express').Router()
const { ReadingList, User, Blog } = require('../models')
const { userExtractor } = require('../middleware/auth')

// Exercise 21: Add blog to reading list
router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  // Validate that blog exists
  const blog = await Blog.findByPk(blogId)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  // Validate that user exists
  const user = await User.findByPk(userId)
  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  // Create reading list entry
  const readingList = await ReadingList.create({
    blogId,
    userId,
    read: false
  })

  res.status(201).json(readingList)
})

// Exercise 23: Mark blog as read
router.put('/:id', userExtractor, async (req, res) => {
  const { read } = req.body
  const user = req.user

  const readingListEntry = await ReadingList.findByPk(req.params.id)

  if (!readingListEntry) {
    return res.status(404).json({ error: 'reading list entry not found' })
  }

  // User can only mark their own reading list entries
  if (readingListEntry.userId !== user.id) {
    return res.status(403).json({ error: 'you can only modify your own reading list' })
  }

  if (read !== undefined) {
    readingListEntry.read = read
  }

  await readingListEntry.save()
  res.json(readingListEntry)
})

module.exports = router
