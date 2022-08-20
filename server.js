const express = require('express');
const app = express();
const http = require('http');
const expressServer = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(expressServer);

app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connect', function (socket) {
  io.to(socket.id).emit('getName', () => {
    socket.on('setName', function (name, cb) {
      socket.name = name;
      cb();
    });
  });

  socket.on('new-message', function (msg, cb) {
    socket.broadcast.emit('receive-msg',socket.name,  msg);
    cb();
  });

  // server connect and disconnect socket
  console.log('New user connected');
  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
});

expressServer.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
