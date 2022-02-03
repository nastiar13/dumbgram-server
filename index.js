require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});
const cors = require('cors');
const router = require('./src/routes');

require('./src/socket')(io);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/', router);

server.listen(5000);
