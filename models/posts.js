'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      posts.belongsTo(models.users, {
        as: 'post_owner',
        foreignKey: 'user_id',
      }),
        posts.belongsTo(models.comments, {
          as: 'comment_owner',
          foreignKey: 'id',
        }),
        posts.hasMany(models.likes, {
          as: 'likes',
          foreignKey: 'post_id',
        });
    }
  }
  posts.init(
    {
      user_id: DataTypes.INTEGER,
      url: DataTypes.STRING,
      public_id: DataTypes.STRING,
      caption: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'posts',
    },
  );
  return posts;
};
