'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      likes.belongsTo(models.users, {
        as: 'like_owner',
        foreignKey: 'user_id',
      }),
        likes.belongsTo(models.posts, {
          as: 'post',
          foreignKey: 'post_id',
        });
    }
  }
  likes.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'likes',
    },
  );
  return likes;
};
