const fs=require('fs')
const https = require('https')
exports.app_port=3000
exports.database='pizza-test'
exports.mongodb_server_host="127.0.0.1"
exports.mongodb_server_port="27017"
exports.server=https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  })