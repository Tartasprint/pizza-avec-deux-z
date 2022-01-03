editor = require('./controllers/editor')
module.exports = function message_handler(socket) {
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