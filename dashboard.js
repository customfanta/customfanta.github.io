document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Accesso non autorizzato. Effettua il login.");
        window.location.href = "index.html";
        return;
    }

    // Mostriamo le informazioni dell'utente
    document.getElementById("user-info").textContent = `Ciao, ${user.nome} (${user.username})`;

    // Se l'utente è ADMIN, mostriamo il pulsante Admin
    if (user.profile === "ADMIN") {
        document.getElementById("admin-btn").style.display = "block";
    }

    // Recuperiamo la squadra dell'utente
    await fetchTeam(user.username);
});

async function fetchTeam(username) {
    try {
        const response = await fetch(`https://customfantabe.onrender.com/recupera-squadra/${username}`);
        const data = await response.json();

        if (response.ok && data) {
            console.log("Squadra trovata:", data);
            populateTeamTable(data);
        } else {
            console.log("Nessuna squadra trovata. L'utente può crearne una.");
        }
    } catch (error) {
        console.error("Errore nel recupero della squadra:", error);
    }
}

// Popola la tabella con i dati della squadra
function populateTeamTable(team) {
    document.getElementById("squadra-nome").value = team.nome || "";
    document.getElementById("player1").value = team.giocatore1 || "";
    document.getElementById("player2").value = team.giocatore2 || "";
    document.getElementById("player3").value = team.giocatore3 || "";
    document.getElementById("player4").value = team.giocatore4 || "";
    document.getElementById("player5").value = team.giocatore5 || "";
}

// Salva la squadra (nuova o modificata)
async function saveTeam() {
    const user = JSON.parse(localStorage.getItem("user"));

    const teamData = {
        username: user.username,
        nome: document.getElementById("squadra-nome").value,
        giocatore1: document.getElementById("player1").value,
        giocatore2: document.getElementById("player2").value,
        giocatore3: document.getElementById("player3").value,
        giocatore4: document.getElementById("player4").value,
        giocatore5: document.getElementById("player5").value,
    };

    try {
        const response = await fetch("https://customfantabe.onrender.com/salva-squadra", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teamData),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Squadra salvata con successo!");
        } else {
            alert("Errore nel salvataggio: " + (data.message || "Riprova più tardi."));
        }
    } catch (error) {
        console.error("Errore nel salvataggio della squadra:", error);
        alert("Errore durante il salvataggio.");
    }
}

// Funzione per reindirizzare al Pannello Admin
function goToAdminPanel() {
    window.location.href = "pannello-admin.html";
}

// Funzione per il logout
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
