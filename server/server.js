// Event Acknowledgements 7:12

const path = require('path');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
var { generateMessage, generateLocationMessage } = require('./utils/message');
var { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

io.on('connection', function(socket) {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Wellcome to the chat app'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room name are required.');
        }

        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        // callback('This is from server');
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        // io.emit('newMessage', generateMessage('Admin', `${coords.latitude},${coords.longitude}`))
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))

    })

    socket.on('disconnect', function() {
        console.log('User was disconnected');
    });
});

server.listen(3000, () => {
    console.log(`Server is up on port ${port}`);
})