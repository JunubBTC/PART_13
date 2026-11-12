require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const testConnection = async () => {
  try {
    console.log('Attempting to connect to database...')
    console.log('Connection URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'))
    
    await sequelize.authenticate()
    console.log('✅ Connection has been established successfully!')
    
    // Test query
    const result = await sequelize.query('SELECT version()')
    console.log('\n📊 PostgreSQL Version:')
    console.log(result[0][0].version)
    
    await sequelize.close()
    console.log('\n✅ Connection closed successfully')
  } catch (error) {
    console.error('\n❌ Unable to connect to the database:')
    console.error('Error:', error.message)
    console.error('\nMake sure:')
    console.error('1. Docker Desktop is running')
    console.error('2. PostgreSQL container is started')
    console.error('3. The .env file has the correct DATABASE_URL')
    process.exit(1)
  }
}

testConnection()
