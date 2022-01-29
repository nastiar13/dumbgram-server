const { posts, users, followings, likes } = require('../../models');
const { use } = require('../routes');
const cloudinary = require('../utils/cloudinary');

exports.postFeed = async (req, res) => {
  try {
    const id = req.user.id;
    const { caption } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'auto',
      folder: 'Dumb-Gram',
    });

    const response = await posts.create(
      {
        user_id: id,
        caption,
        public_id: result.public_id,
        url:
          'https://res.cloudinary.com/dtxnrrstp/image/upload/q_60:420,f_webp/' +
          result.public_id,
      },
      {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    );

    res.send({
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

exports.getFeeds = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await posts.findAll(
      { where: { user_id: id } },
      {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    );

    res.status(200).send({
      posts: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.getAllFeeds = async (req, res) => {
  try {
    const response = await posts.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      include: {
        model: users,
        as: 'post_owner',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    });
    res.status(200).send({
      posts: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.getFeedsByFollowing = async (req, res) => {
  try {
    const id = req.user.id;
    const foll_user = await followings.findAll({
      where: {
        user_id: id,
      },
      attributes: {
        exclude: ['id', 'user_id', 'createdAt', 'updatedAt'],
      },
    });
    const response = await posts.findAll({
      where: {
        user_id: foll_user.map((a) => a.following_user_id),
      },
    });

    res.status(200).send({
      posts: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};

exports.deleteFeeds = async (req, res) => {
  try {
    const id = req.params.id;
    const feed = await posts.findOne({ where: { id } });
    const result = await cloudinary.uploader.destroy(feed.public_id);
    const response = await posts.destroy({ where: { id } });

    res.status(200).send({
      posts: response,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
