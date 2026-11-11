require('dotenv').config()
const { sequelize } = require('./db')
const { User, Post, Like, Comment, Share } = require('../models')

const initDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connection established successfully.')

    // Sync all models
    await sequelize.sync({ alter: true })
    console.log('✅ All models synchronized successfully.')

    console.log('\n📊 Database tables created:')
    console.log('  - users')
    console.log('  - posts')
    console.log('  - likes')
    console.log('  - comments')
    console.log('  - shares')

    await sequelize.close()
    console.log('\n✅ Database initialization complete!')
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    process.exit(1)
  }
}

initDatabase()
