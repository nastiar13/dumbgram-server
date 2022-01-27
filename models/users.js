'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.posts, {
        as: 'posts',
        foreignKey: 'user_id',
      }),
        users.hasMany(models.followings, {
          as: 'follow_by',
          foreignKey: 'user_id',
        }),
        users.hasMany(models.followings, {
          as: 'follow_to',
          foreignKey: 'following_user_id',
        }),
        users.hasMany(models.comments, {
          as: 'comment',
          foreignKey: 'user_id',
        }),
        users.hasMany(models.likes, {
          as: 'like',
          foreignKey: 'user_id',
        }),
        users.hasMany(models.conversations, {
          as: 'from_user',
          foreignKey: 'from_user',
        }),
        users.hasMany(models.conversations, {
          as: 'to_user',
          foreignKey: 'to_user',
        }),
        users.hasMany(models.messages, {
          as: 'message_creator',
          foreignKey: 'from_user',
        }),
        users.hasMany(models.messages, {
          as: 'message_recipient',
          foreignKey: 'to_user',
        });
    }
  }
  users.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      profile_picture: DataTypes.STRING,
      is_online: DataTypes.ENUM('0', '1'),
    },
    {
      sequelize,
      modelName: 'users',
    },
  );
  return users;
};
