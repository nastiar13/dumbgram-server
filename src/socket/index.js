const { Op } = require('sequelize');
const { conversations, users, messages } = require('../../models');
const jwt = require('jsonwebtoken');

const connectedUser = {};
const socketIo = (io) => {
  io.use((socket, next) => {
    if (!socket.handshake.auth.token) {
      return next(new Error('Not Authorized!'));
    }
    next();
  });

  io.on('connection', (socket) => {
    const id = jwt.verify(
      socket.handshake.auth.token,
      process.env.TOKEN_KEY,
    ).id;
    connectedUser[socket.handshake.query.id] = socket.id;
    socket.on('load conversations', async (payload) => {
      try {
        const { user_id } = payload;
        const response = await conversations.findAll({
          where: {
            [Op.or]: [{ from_user: user_id }, { to_user: user_id }],
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
          order: [['updatedAt', 'DESC']],
        });
        socket.emit('conversations', response);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('load messages', async ({ convId }) => {
      try {
        const response = await messages.findAll({
          where: {
            conversation_id: convId,
          },
          include: {
            model: users,
            as: 'creator',
            attributes: {
              exclude: ['password', 'createdAt', 'updatedAt'],
            },
          },
          order: [['createdAt', 'ASC']],
        });

        socket.emit('messages', response);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('send message', async (data) => {
      try {
        const { target_id, message_body } = data;
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
            message_body: message_body,
          });
        } else {
          result = await messages.create({
            conversation_id: conv.id,
            from_user: id,
            to_user: target_id,
            message_body: message_body,
          });
          await conversations.update(
            { to_user: target_id, from_user: id },
            { where: { id: conv.id } },
          );
        }
        io.to(socket.id).to(connectedUser[target_id]).emit('new message');
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('disconnect', () => {
      console.log('disconnect ===================================');
    });
  });
};

module.exports = socketIo;
