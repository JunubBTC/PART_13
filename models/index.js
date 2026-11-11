const User = require('./user')
const Post = require('./post')
const Like = require('./like')
const Comment = require('./comment')
const Share = require('./share')

// User and Post associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' })
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// User and Like associations
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' })
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Post and Like associations
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' })
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

// User and Comment associations
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' })
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Post and Comment associations
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' })
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

// User and Share associations
User.hasMany(Share, { foreignKey: 'userId', as: 'shares' })
Share.belongsTo(User, { foreignKey: 'userId', as: 'user' })

// Post and Share associations
Post.hasMany(Share, { foreignKey: 'postId', as: 'shares' })
Share.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

// Many-to-Many: Users can like many Posts, Posts can be liked by many Users
User.belongsToMany(Post, { through: Like, as: 'likedPosts', foreignKey: 'userId' })
Post.belongsToMany(User, { through: Like, as: 'likedByUsers', foreignKey: 'postId' })

module.exports = {
  User,
  Post,
  Like,
  Comment,
  Share
}
