'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      comments.belongsTo(models.users, {
        as: 'comment_user',
        foreignKey: 'id',
      }),
        comments.belongsTo(models.posts, {
          as: 'post',
          foreignKey: 'id',
        });
    }
  }
  comments.init(
    {
      user_id: DataTypes.INTEGER,
      posts_id: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'comments',
    },
  );
  return comments;
};
