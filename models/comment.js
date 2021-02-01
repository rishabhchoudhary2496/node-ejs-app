'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Reply }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId',as:'user' })
      this.hasMany(Reply, { foreignKey: 'commentId' })
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
      }
    }
  }
  Comment.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'comments',
      modelName: 'Comment',
    }
  )
  return Comment
}
