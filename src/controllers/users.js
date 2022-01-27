const { users } = require('../../models');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');

exports.register = async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(3).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: 'Failed',
      message: error.details[0].message,
    });
  }

  const isDup = await users.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (isDup) {
    return res.status(400).send({
      status: 'Failed',
      message: 'Your email is already registerd!',
    });
  }

  try {
    const data = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(data.password, salt);

    const response = await users.create({
      ...data,
      password: hashedPass,
    });

    const token = jwt.sign({ id: response.id }, process.env.TOKEN_KEY);
    res.status(200).send({
      status: 'success',
      message: 'Thank you for joining the Dumbgram!',
      user_data: {
        username: response.username,
        email: response.email,
        token_key: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'server error',
    });
  }
};

exports.login = async (req, res) => {
  const data = req.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const { error } = schema.validate(data);

  if (error) {
    return res.status(400).send({
      status: 'Failed',
      message: error.details[0].message,
    });
  }
  try {
    const response = await users.findOne({
      where: {
        email: data.email,
      },
    });

    if (!response) {
      return res.status(400).send({
        status: 'Failed',
        message: 'Your email is not registered, please register your email!',
      });
    }

    const isPassValid = await bcrypt.compare(data.password, response.password);

    if (!isPassValid) {
      return res.status(400).send({
        status: 'Failed',
        message: 'Incorrect password!',
      });
    }

    const token = jwt.sign({ id: response.id }, process.env.TOKEN_KEY);

    res.status(200).send({
      status: 'Success',
      message: 'Login success',
      user: {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        token_key: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const response = await users.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
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
exports.getOneUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const response = await users.findOne(
      { where: { id } },
      {
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    );
    res.status(200).send({
      user: response,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.editUser = async (req, res) => {
  try {
    const id = req.user.id;
    const response = await users.update(req.body, { where: { id } });
    const newData = await users.findOne({ where: { id } });
    console.log(req.user);
    res.status(200).send({
      new_data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};
exports.editUserWithPhoto = async (req, res) => {
  try {
    const id = req.user.id;
    const oldData = await users.findOne({
      where: {
        id,
      },
    });
    if (oldData.url) {
      const urlArr = oldData.url.split('/');
      const public_id = urlArr[7] + '/' + urlArr[8].split('.')[0];
      const destroy = await cloudinary.uploader.destroy(public_id);
    }
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: 'dumbgram-profile',
    });
    const response = await users.update(
      {
        ...req.body,
        public_id: upload.public_id,
        url: upload.secure_url,
      },
      { where: { id } },
    );
    const newData = await users.findOne({ where: { id } });
    console.log(req.user);
    res.status(200).send({
      new_data: newData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'Failed',
      message: 'Server error',
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await users.destroy({ where: { id } });
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
