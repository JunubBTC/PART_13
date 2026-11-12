require('dotenv').config()
const { sequelize } = require('./utils/db')
const { Blog, User } = require('./models')

const main = async () => {
  try {
    await sequelize.authenticate()
    
    const blogs = await Blog.findAll({
      attributes: ['id', 'author', 'title', 'likes'],
      include: {
        model: User,
        as: 'user',
        attributes: ['name']
      }
    })
    
    console.log('\n📚 Blogs in database:\n')
    blogs.forEach(blog => {
      console.log(`${blog.author || 'Anonymous'}: '${blog.title}', ${blog.likes} likes`)
      if (blog.user) {
        console.log(`  Added by: ${blog.user.name}`)
      }
      console.log('')
    })
    
    await sequelize.close()
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

main()
