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
const postsRouter = require('./controllers/posts')
const likesRouter = require('./controllers/likes')
const commentsRouter = require('./controllers/comments')
const sharesRouter = require('./controllers/shares')

const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('ok')
})

// API routes
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/posts', postsRouter)
app.use('/api/likes', likesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/shares', sharesRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

start()
