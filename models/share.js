const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Share extends Model {}

Share.init({
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
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'share'
})

module.exports = Share
