const fs = require('fs')
const https = require('https')
const config = require('./config')
const { WebSocketServer } = require('ws');
const ws_handler = require('./index.ws')
const {app,server} = require('./app')

//#region Mongo DB
const mongoose = require('mongoose')
const mongoDB = `mongodb://${config.mongodb_server_host}:${config.mongodb_server_port}/${config.database}`;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//#endregion

//#region Websocket
const wsserver = https.createServer(config.credentials)
const wss = new WebSocketServer({ server: wsserver });


wss.on('connection', socket => {
  console.log("New connection")
  socket.on('message', ws_handler(socket));
  socket.on('close', ()=> console.log("Connection closed"))
});

wsserver.listen(config.ws_port, function () {
  console.log(`Websocket server listening on port ${config.ws_port}!`)
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, socket => {
    wss.emit('connection', socket, request);
  });
});
//#endregion