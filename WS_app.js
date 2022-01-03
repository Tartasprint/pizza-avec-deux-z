const { WebSocketServer } = require('ws');
editor = require('./controllers/editor')

exports.WSApp = (server) => {
    const wss = new WebSocketServer({ server: server });
    function ws_handler(socket) {
        function r(message) {
            message=message.toString()
            message=JSON.parse(message)
            if(message.query === "update"){
                console.log("UPDATE !")
                editor.update(socket,message.body)
            } else if(message.query === "load"){
                console.log("LOAD !")
                editor.load(socket,message.body)
            } else if(message.query === "delete"){
                console.log("DELETE !")
                editor.delete(socket,message.body)
            }
        }
        return r
    }
    wss.on('connection', socket => {
      console.log("New connection")
      socket.on('message', ws_handler(socket));
      socket.on('close', ()=> console.log("Connection closed"))
    });
    return wss
}