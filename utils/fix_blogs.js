require('dotenv').config()
const { sequelize } = require('./db')

const fixBlogs = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to the database')

    // Drop blogs table completely to start fresh
    console.log('\n🔧 Dropping blogs table to start fresh...')
    await sequelize.query('DROP TABLE IF EXISTS blogs CASCADE')
    console.log('✅ Blogs table dropped')

    await sequelize.close()
    console.log('\n✅ Database fixed! Now run: npm start')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

fixBlogs()
