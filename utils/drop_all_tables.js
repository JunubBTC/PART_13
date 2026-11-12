require('dotenv').config()
const { sequelize } = require('./db')

const dropAllTables = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connected to the database')

    // Drop all tables
    console.log('\n🗑️  Dropping all tables...')
    await sequelize.query('DROP TABLE IF EXISTS migrations CASCADE')
    await sequelize.query('DROP TABLE IF EXISTS shares CASCADE')
    await sequelize.query('DROP TABLE IF EXISTS comments CASCADE')
    await sequelize.query('DROP TABLE IF EXISTS likes CASCADE')
    await sequelize.query('DROP TABLE IF EXISTS posts CASCADE')
    await sequelize.query('DROP TABLE IF EXISTS blogs CASCADE')
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE')
    
    console.log('✅ All tables dropped')

    await sequelize.close()
    console.log('\n✅ Database reset complete! Now run: npm start')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

dropAllTables()
