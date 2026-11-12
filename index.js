require('dotenv').config()
require('express-async-errors')
const express = require('express')
const cors = require('cors')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')
const { tokenExtractor } = require('./middleware/auth')
const errorHandler = require('./middleware/errorHandler')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const postsRouter = require('./controllers/posts')
const likesRouter = require('./controllers/likes')
const commentsRouter = require('./controllers/comments')
const sharesRouter = require('./controllers/shares')
const blogsRouter = require('./controllers/blogs')
const authorsRouter = require('./controllers/authors')
const readingListsRouter = require('./controllers/readingLists')
const { Blog } = require('./models')

const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

// Exercise 17: Root endpoint
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('ok')
})

// Exercise 17: Reset database (for testing)
if (process.env.TESTING === 'true') {
  app.post('/api/reset', async (req, res) => {
    const { Blog, User, Post, Like, Comment, Share, ReadingList, Session } = require('./models')
    await Share.destroy({ where: {} })
    await Comment.destroy({ where: {} })
    await Like.destroy({ where: {} })
    await Post.destroy({ where: {} })
    await ReadingList.destroy({ where: {} }) // Exercise 26: Clear reading lists
    await Session.destroy({ where: {} }) // Exercise 26: Clear sessions
    await Blog.destroy({ where: {} })
    await User.destroy({ where: {} })
    res.status(204).end()
  })
}

// API routes
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter) // Exercise 25
app.use('/api/posts', postsRouter)
app.use('/api/likes', likesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/shares', sharesRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListsRouter) // Exercise 21-23

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

start()
