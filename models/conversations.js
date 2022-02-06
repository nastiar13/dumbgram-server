'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conversations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      conversations.belongsTo(models.users, {
        as: 'from',
        foreignKey: 'from_user',
      }),
        conversations.belongsTo(models.users, {
          as: 'to',
          foreignKey: 'to_user',
        }),
        conversations.hasMany(models.messages, {
          as: 'messages',
          foreignKey: 'conversation_id',
        });
      conversations.hasMany(models.messages, {
        as: 'unread',
        foreignKey: 'conversation_id',
      });
    }
  }
  conversations.init(
    {
      from_user: DataTypes.INTEGER,
      to_user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'conversations',
    },
  );
  return conversations;
};
