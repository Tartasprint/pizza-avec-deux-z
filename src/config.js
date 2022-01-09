const fs = require('fs')
const https = require('https')
const session = require('express-session')
const MongoStore = require('connect-mongo')
exports.app_port = 3000
exports.database = 'pizza-test'
exports.mongodb_server_host = "127.0.0.1"
exports.mongodb_server_port = "27017"
exports.server = https.createServer({
  key: fs.readFileSync('../secrets/key.pem'),
  cert: fs.readFileSync('../secrets/cert.pem')
})
exports.sessions_secrets = JSON.parse(fs.readFileSync('../secrets/sessions-secrets.json').toString())
exports.sessions_database = exports.database + '-session'
exports.session_parser = session({
  name: "__Host-id",
  resave: false,
  saveUninitialized: false,
  secret: exports.sessions_secrets,
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    domain: "",
    path: '/',
  },
  store: MongoStore.create({
    mongoUrl: `mongodb://${exports.mongodb_server_host}:${exports.mongodb_server_port}/${exports.sessions_database}`
  })
})