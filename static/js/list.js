const websocket = new WebSocket("ws://localhost:3000/")
let deleteDocument = () => {}
websocket.onopen = (_event) => {
    deleteDocument = function(id){
        websocket.send(JSON.stringify({query: "delete", body: {id: id}}))
        document.getElementById(id).parentElement.remove()
    }
}
