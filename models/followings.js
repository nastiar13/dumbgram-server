'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class followings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      followings.belongsTo(models.users, {
        as: 'user',
        foreignKey: 'user_id',
      });
      followings.belongsTo(models.users, {
        as: 'follow_to',
        foreignKey: 'following_user_id',
      });
    }
  }
  followings.init(
    {
      user_id: DataTypes.INTEGER,
      following_user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'followings',
    },
  );
  return followings;
};
