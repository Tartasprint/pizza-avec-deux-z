const fs = require('fs')
const https = require('https')
exports.app_port = 3000
exports.database = 'pizza-test'
exports.mongodb_server_host = "127.0.0.1"
exports.mongodb_server_port = "27017"
exports.server = https.createServer({
  key: fs.readFileSync('secrets/key.pem'),
  cert: fs.readFileSync('secrets/cert.pem')
})
exports.sessions_secrets = JSON.parse(fs.readFileSync('secrets/sessions-secrets.json').toString())
exports.sessions_database = exports.database + '-session'