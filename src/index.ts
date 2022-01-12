import *  as config from './config/index.js';
import { WSApp } from './WS_app.js';
import { HTTPApp } from './HTTP_app.js';
import { initOso } from './config/initOso.js';
initOso().then((oso) => {
  WSApp(config.server, config.session_parser, oso)
  HTTPApp(config.server, config.session_parser, oso)
})

//#region Mongo DB
import mongoose from 'mongoose';
const mongoDB = `mongodb://${config.mongodb_server_host}:${config.mongodb_server_port}/${config.database}`;
mongoose.connect(mongoDB, {});
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
//#endregion

config.server.on('listening', function () {
  console.log(`Normal server listening on port ${config.app_port}!`)
})

config.server.listen(config.app_port)