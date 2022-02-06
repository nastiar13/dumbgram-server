const { messages, conversations, users, sequelize } = require('../../models');
const { Op } = require('sequelize');
const { response } = require('express');

exports.sendMessage = async (req, res) => {
  try {
    const id = req.user.id;
    const target_id = parseInt(req.params.id);
    const conv = await conversations.findOne({
      where: {
        [Op.or]: [
          { from_user: id, to_user: target_id },
          { from_user: target_id, to_user: id },
        ],
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    });
    let result;
    if (!conv) {
      const dialog = await conversations.create({
        from_user: id,
        to_user: target_id,
      });
      result = await messages.create({
        conversation_id: dialog.id,
        from_user: id,
        to_user: target_id,
        message_body: req.body.message,
      });
    } else {
      result = await messages.create({
        conversation_id: conv.id,
        from_user: id,
        to_user: target_id,
        message_body: req.body.message,
      });
      await conversations.update(
        { to_user: target_id, from_user: id },
        { where: { id: conv.id } },
      );
    }
    res.status(200).send({
      result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
    });
  }
};

exports.getMessagesFromConv = async (req, res) => {
  try {
    const response = await messages.findAll({
      where: {
        conversation_id: req.params.id,
      },
      include: {
        model: users,
        as: 'creator',
        attributes: {
          exclude: ['password', 'createdAt', 'updatedAt'],
        },
      },
    });
    res.status(200).send({
      messages: response,
    });
  } catch (error) {
    console.log(error);

    res.send({
      error,
    });
  }
};
exports.getUserConv = async (req, res) => {
  try {
    const id = req.user.id;
    const response = await conversations.findAll({
      where: {
        [Op.or]: [{ from_user: id }, { to_user: id }],
      },
      include: [
        {
          model: users,
          as: 'from',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: users,
          as: 'to',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
      ],
      order: [['updatedAt', 'ASC']],
    });
    res.status(200).send({
      inbox: response,
    });
  } catch (error) {
    console.log(error);

    res.send({
      error,
    });
  }
};
exports.getOneConv = async (req, res) => {
  try {
    const id = req.params.id;

    const response = await conversations.findOne({
      where: {
        id,
      },
      include: [
        {
          model: users,
          as: 'from',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: users,
          as: 'to',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });

    res.status(200).send({
      conv: response,
    });
  } catch (error) {
    console.log(error);
    res.send({
      error,
    });
  }
};

exports.createConv = async (req, res) => {
  try {
    const id = req.user.id;
    const target_id = req.params.id;
    let response;
    const isDup = await conversations.findOne({
      where: {
        [Op.or]: [
          { from_user: id, to_user: target_id },
          { from_user: target_id, to_user: id },
        ],
      },
    });
    if (!isDup) {
      response = await conversations.create({
        from_user: id,
        to_user: target_id,
      });
    }

    res.status(200).send({
      status: 'Success',
      convId: response ? response.id : isDup.id,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
};
