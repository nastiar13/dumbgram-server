const { followings, users } = require('../../models');

exports.addFollow = async (req, res) => {
  try {
    const id = req.user.id;
    const target_id = req.params.id;
    const response = await followings.create({
      user_id: id,
      following_user_id: parseInt(target_id),
    });
    res.status(200).send({
      response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.unFollow = async (req, res) => {
  try {
    const id = req.user.id;
    const target_id = req.params.id;
    const response = await followings.destroy({
      where: {
        user_id: id,
        following_user_id: parseInt(target_id),
      },
    });
    res.status(200).send({
      row_deleted: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const id = req.user.id;
    const response = await followings.findAll({
      where: {
        user_id: id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: {
        model: users,
        as: 'follow_to',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    });
    res.status(200).send({
      following: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.getFollowingById = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await followings.findAll({
      where: {
        user_id: id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: {
        model: users,
        as: 'follow_to',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    });
    res.status(200).send({
      following: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.getFollowers = async (req, res) => {
  try {
    const id = req.user.id;
    const response = await followings.findAll({
      where: {
        following_user_id: id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: {
        model: users,
        as: 'user',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    });
    res.status(200).send({
      followers: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.getFollowersById = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await followings.findAll({
      where: {
        following_user_id: id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: {
        model: users,
        as: 'user',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    });
    res.status(200).send({
      followers: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
