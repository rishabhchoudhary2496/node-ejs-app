'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Reply extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Comment }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' }),
        this.belongsTo(Comment, { foreignKey: 'commentId', as: 'comment' })
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
        commentId: undefined
      }
    }
  }
  Reply.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull:false
      },
    },
    {
      sequelize,
      tableName:'replies',
      modelName: 'Reply',
    }
  )
  return Reply
}
