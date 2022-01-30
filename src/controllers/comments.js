const { comments, users } = require('../../models');

exports.addComments = async (req, res) => {
  try {
    const id = req.user.id;
    const response = await comments.create(
      {
        ...req.body,
        user_id: id,
        posts_id: req.params.id,
      },
      {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    );
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
exports.getComments = async (req, res) => {
  try {
    const response = await comments.findAll({
      where: {
        posts_id: req.params.id,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'posts_id'],
      },
      include: {
        model: users,
        as: 'user_comment',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
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
exports.deleteComments = async (req, res) => {
  try {
    const response = await comments.destroy({
      where: {
        id: req.params.id,
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
