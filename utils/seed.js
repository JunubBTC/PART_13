require('dotenv').config()
const bcrypt = require('bcrypt')
const { sequelize } = require('./db')
const { User, Post, Like, Comment, Share } = require('../models')

const seedDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Connection established successfully.')

    // Clear existing data (be careful with this in production!)
    await Share.destroy({ where: {} })
    await Comment.destroy({ where: {} })
    await Like.destroy({ where: {} })
    await Post.destroy({ where: {} })
    await User.destroy({ where: {} })

    console.log('🗑️  Cleared existing data')

    // Create users
    const passwordHash = await bcrypt.hash('password123', 10)

    const user1 = await User.create({
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash,
      bio: 'Full-stack developer who loves coding and coffee ☕',
      avatar: 'https://i.pravatar.cc/150?img=1'
    })

    const user2 = await User.create({
      username: 'jane_smith',
      name: 'Jane Smith',
      email: 'jane@example.com',
      passwordHash,
      bio: 'Designer & Creative Thinker 🎨',
      avatar: 'https://i.pravatar.cc/150?img=5'
    })

    const user3 = await User.create({
      username: 'bob_wilson',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      passwordHash,
      bio: 'Tech enthusiast | Gamer | Blogger',
      avatar: 'https://i.pravatar.cc/150?img=12'
    })

    console.log('✅ Created 3 users')

    // Create posts
    const post1 = await Post.create({
      content: 'Just finished building an amazing blog application with PostgreSQL and Sequelize! 🚀 The power of relational databases is incredible.',
      imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      userId: user1.id
    })

    const post2 = await Post.create({
      content: 'Beautiful sunset today! Nature never fails to amaze me. 🌅',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      userId: user2.id
    })

    const post3 = await Post.create({
      content: 'Learning PostgreSQL has been an amazing journey. The difference between document and relational databases is fascinating! #database #learning',
      userId: user1.id
    })

    const post4 = await Post.create({
      content: 'Just deployed my first full-stack application! Feeling accomplished 💪',
      userId: user3.id
    })

    const post5 = await Post.create({
      content: 'Coffee and code - the perfect combination for a productive day! ☕💻',
      imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
      userId: user2.id
    })

    console.log('✅ Created 5 posts')

    // Create likes
    await Like.create({ userId: user1.id, postId: post2.id })
    await Like.create({ userId: user2.id, postId: post1.id })
    await Like.create({ userId: user3.id, postId: post1.id })
    await Like.create({ userId: user1.id, postId: post4.id })
    await Like.create({ userId: user2.id, postId: post3.id })
    await Like.create({ userId: user3.id, postId: post2.id })
    await Like.create({ userId: user1.id, postId: post5.id })
    await Like.create({ userId: user3.id, postId: post5.id })

    console.log('✅ Created 8 likes')

    // Create comments
    await Comment.create({
      content: 'This is awesome! I should try PostgreSQL too.',
      userId: user2.id,
      postId: post1.id
    })

    await Comment.create({
      content: 'Great work! Looking forward to seeing more.',
      userId: user3.id,
      postId: post1.id
    })

    await Comment.create({
      content: 'Absolutely stunning! Where was this taken?',
      userId: user1.id,
      postId: post2.id
    })

    await Comment.create({
      content: 'Congratulations! That\'s a huge milestone 🎉',
      userId: user2.id,
      postId: post4.id
    })

    await Comment.create({
      content: 'Couldn\'t agree more! ☕',
      userId: user3.id,
      postId: post5.id
    })

    console.log('✅ Created 5 comments')

    // Create shares
    await Share.create({
      userId: user2.id,
      postId: post1.id,
      caption: 'Everyone should check this out! Great explanation of PostgreSQL.'
    })

    await Share.create({
      userId: user3.id,
      postId: post5.id,
      caption: 'This is me every morning! 😄'
    })

    console.log('✅ Created 2 shares')

    await sequelize.close()
    console.log('\n✅ Database seeded successfully!')
    console.log('\n📝 Test credentials:')
    console.log('   Username: john_doe (or jane_smith, bob_wilson)')
    console.log('   Password: password123')
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
