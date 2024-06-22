const { Server } = require('socket.io');
const express = require('express');
const { createServer } = require('http');
// import { Server } from "socket.io";
// import express from "express";
// import { createServer } from "http";

// express server
const app = express({
	cors: {
		origin: '*'
	}
});
// HTTP server
const server = createServer(app, {
	// key: readFileSync('/path/to/server-key.pem'),
	// cert: readFileSync('/path/to/server-cert.pem'),
	// requestCert: true,
	// ca: [readFileSync('/path/to/client-cert.pem')]
});
// Socket io server
const io = new Server(server, {
	cors: {
		origin: '*'
	}
});

// Socket connection
io.on('connection', (socket) => {
	// console.log(io.engine.clientsCount);;

	socket.on('join', (room) => {
		socket.join(room);
	});

	socket.on('send', (data) => {
		io.to(data.room).emit('receive', { text: data.text, by: data.by , time: data.time });
	})
});

io.on('connection_error', (err) => {
	console.log(err);
});

// Express functions (REST API's)
app.get('/', (req, res) => {
	res.send('Hello World');
});

server.listen(3000,() =>{
	console.log('Server is running on port 3000');
});
