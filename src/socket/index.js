const { Op } = require('sequelize');
const {
  conversations,
  users,
  messages,
  comments,
  posts,
} = require('../../models');
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
            {
              model: messages,
              as: 'messages',
              order: [['createdAt', 'DESC']],
              limit: 1,
            },
            // {
            //   model: messages,
            //   as: 'unread',
            //   order: [['createdAt', 'DESC']],
            //   where: {
            //     is_read: '0',
            //   },
            // },
          ],
          order: [['updatedAt', 'DESC']],
        });
        console.log(response);
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

    socket.on('message was readed', async (data) => {
      try {
        const { convId, target_id } = data;
        const res = await messages.update(
          {
            is_read: '1',
          },
          {
            where: {
              [Op.and]: [
                { conversation_id: convId },
                { to_user: id },
                { is_read: '0' },
              ],
            },
          },
        );
        io.to(socket.id).to(connectedUser[target_id]).emit('message updated');
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('load notif', async () => {
      try {
        const myPosts = await posts.findAll({
          where: {
            user_id: id,
          },
        });
        const notif = await comments.findAll({
          where: {
            posts_id: myPosts.map((post) => post.id),
          },
          include: {
            model: users,
            as: 'user_comment',
            attributes: {
              exclude: ['password', 'email', 'createdAt', 'updatedAt'],
            },
          },
          order: [['createdAt', 'DESC']],
          limit: 2,
        });

        socket.emit('notif', notif);
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
