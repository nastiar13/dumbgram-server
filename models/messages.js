'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      messages.belongsTo(models.users, {
        as: 'creator',
        foreignKey: 'from_user',
      }),
        messages.belongsTo(models.conversations, {
          as: 'conv',
          foreignKey: 'conversation_id',
        });
    }
  }
  messages.init(
    {
      conversation_id: DataTypes.INTEGER,
      from_user: DataTypes.INTEGER,
      to_user: DataTypes.INTEGER,
      message_body: DataTypes.TEXT,
      is_read: DataTypes.ENUM('0', '1'),
    },
    {
      sequelize,
      modelName: 'messages',
    },
  );
  return messages;
};
