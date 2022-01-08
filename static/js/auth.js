import { createAlert } from "./alert.mjs";

const hash =
    async (message) => {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }


let main = () => {
    let form = document.getElementById('login_form');
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        let data = new FormData(form);
        hash(data.get('password')).then((hashed) => {
            data.set('password', hashed)
            fetch('', {
                method: "POST",
                body: data,
                credentials: "same-origin",
                mode: "same-origin",
                cache: "no-store",
            }).then((res) => {
                if (res.status === 200) {
                    window.location.replace(res.url)
                } else if (res.status === 400) {
                    res.json().then((errors) => {
                        for (error of errors) {
                            console.log(error)
                            createAlert('danger', "Error", error.msg)
                        }
                    })
                } else if (res.status === 403) {
                    createAlert('danger', "Error", "Invalid User/Password")
                }
            })
        })
    });
}


window.addEventListener('load', main)