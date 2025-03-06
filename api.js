async function createUser() {
    const username = document.getElementById('username').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
        
    try {
        const response = await fetch('https://customfantabe.onrender.com/create-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                nome: nome,
                mail: email,
                password: password
            })
        });

        const data = await response.json();
        console.log('Successo:', data);
        alert("Registrazione completata con successo!");
        window.location.href = "index.html";

    } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante la registrazione.");
    }
}

async function makeLogin() {
    const username = document.getElementById('username-log').value;
    const email = document.getElementById('email-log').value;
    const password = document.getElementById('password-log').value;

    try {
        const response = await fetch('https://customfantabe.onrender.com/make-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                mail: email,
                password: password
            })
        });

        const data = await response.json();
        console.log('Successo:', data);
        alert("Login effettuato con successo!");

    } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante il login.");
    }
}