const fs=require('fs')
exports.normal_port=3000
exports.ws_port=3001
exports.database='pizza-test'
exports.mongodb_server_host="127.0.0.1"
exports.mongodb_server_port="27017"
exports.credentials={
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }