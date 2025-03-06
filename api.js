async function handleRegister(event) {
    event.preventDefault(); // Evita il refresh della pagina

    const form = event.target;
    const username = form.username.value;
    const nome = form.nome.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await fetch('https://customfantabe.onrender.com/create-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, nome, mail: email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registrazione completata con successo!");
            window.location.href = "index.html"; // Vai alla pagina di login
        } else {
            alert("Errore nella registrazione: " + (data.message || "Controlla i dati inseriti."));
        }

    } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante la registrazione.");
    }
}

async function handleLogin(event) {
    event.preventDefault(); // Evita il refresh della pagina

    const form = event.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await fetch('https://customfantabe.onrender.com/make-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, mail: email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salviamo i dati dell'utente nel localStorage
            localStorage.setItem('user', JSON.stringify(data));

            window.location.href = "dashboard.html"; // Reindirizza alla dashboard
        } else {
            alert("Errore nel login: " + (data.message || "Credenziali errate."));
        }

    } catch (error) {
        console.error("Errore:", error);
        alert("Errore durante il login.");
    }
}

