const config = require('./config')
const { WSApp } = require('./WS_app');
const { HTTPApp } = require('./HTTP_app')

const wsapp = WSApp(config.server)
const httpapp = HTTPApp(config.server)

//#region Mongo DB
const mongoose = require('mongoose')
const mongoDB = `mongodb://${config.mongodb_server_host}:${config.mongodb_server_port}/${config.database}`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//#endregion

config.server.on('listening', function () {
  console.log(`Normal server listening on port ${config.app_port}!`)
})

config.server.listen(config.app_port)