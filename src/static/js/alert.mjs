let createAlert = (kind, title, message, ttl = 2500) => {
    let container = document.getElementById('alert_container');
    let alert = document.createElement('div')
    for (c of ['alert', 'alert-' + kind, 'alert-dismissible', 'fade', 'show']) {
        alert.classList.add(c)
    }
    let titleEl = document.createElement('strong');
    let titleText = document.createTextNode(title);
    titleEl.appendChild(titleText);
    alert.appendChild(titleEl);
    let messageText = document.createTextNode(message)
    alert.appendChild(messageText)
    let button = document.createElement('button');
    button.type = 'button';
    button.dataset.bsDismiss = "alert"
    button.classList.add('btn-close')
    alert.appendChild(button)
    container.appendChild(alert)
    if (ttl) {
        setTimeout(() => {
            $(alert).alert('close')
        }, ttl)
    };
    return alert
}

export { createAlert }