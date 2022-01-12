const websocket = new WebSocket("wss://localhost:3000/")
window.deleteDocument = () => { }
websocket.onopen = (_event) => {
    deleteDocument = function (id) {
        websocket.send(JSON.stringify({ query: "delete", body: { id: id } }))
        document.getElementById(id).parentElement.remove()
    }
}
