const basePath = "https://customfantabe.onrender.com";
//const basePath = "http://localhost:8080";

getUtenteLoggato();

async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const nome = form.nome.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await fetch(basePath + '/create-user', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, nome, mail: email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registrazione completata con successo!");
            window.location.href = "index.html";
        } else {
            alert("Errore nella registrazione: " + (data.message || "Controlla i dati inseriti."));
        }

    } catch (error) {
        console.error("Errore:", error);
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await fetch(basePath + '/make-login', {
            method: 'POST',
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, mail: email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data));

            window.location.href = "dashboard.html";
        }

    } catch (error) {
        console.error("Errore:", error);
    }
}

async function getUtenteLoggato() {
    try {
        const response = await fetch(basePath + '/get-utente-loggato', {
            method: 'GET',
            credentials: "include"
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(data));

            window.location.href = "dashboard.html";
        }

    } catch (error) {
        console.error("Errore:", error);
    }
}
