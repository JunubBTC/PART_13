const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Like extends Model {}

Like.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'posts', key: 'id' }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'like',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id']
    }
  ]
})

module.exports = Like
