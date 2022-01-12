import *  as config from './config';
import { WSApp } from './WS_app.js';
import { HTTPApp } from './HTTP_app.js';

WSApp(config.server, config.session_parser)
HTTPApp(config.server, config.session_parser)

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