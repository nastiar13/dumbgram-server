const { likes, users } = require('../../models');

exports.likePost = async (req, res) => {
  try {
    const target_id = req.params.id;
    const id = req.user.id;
    const response = await likes.create({
      user_id: id,
      post_id: parseInt(target_id),
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
exports.unLike = async (req, res) => {
  try {
    const target_id = req.params.id;
    const id = req.user.id;
    const response = await likes.destroy({
      where: {
        user_id: id,
        post_id: parseInt(target_id),
      },
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
exports.getUserWhoLikesPost = async (req, res) => {
  try {
    const target_id = req.params.id;

    const response = await likes.findAll({
      where: {
        post_id: target_id,
      },
      include: {
        model: users,
        as: 'like_owner',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    res.status(200).send({
      like: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
