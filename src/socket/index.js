const { Op } = require('sequelize');
const { conversations, users } = require('../../models');

const socketIo = (io) => {
  io.use((socket, next) => {
    if (!socket.handshake.auth.token) {
      return next(new Error('Not Authorized!'));
    }
    next();
  });
  io.on('connection', (socket) => {
    console.log('user connected');

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

    socket.on('disconnect', () => {
      console.log('disconnect ===================================');
    });
  });
};

module.exports = socketIo;
