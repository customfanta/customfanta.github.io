document.addEventListener("DOMContentLoaded", function () {
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
});

// Funzione per reindirizzare al Pannello Admin
function goToAdminPanel() {
    window.location.href = "pannello-admin.html";
}

// Funzione per il logout
function logout() {
    localStorage.removeItem("user"); // Rimuove i dati dell'utente
    window.location.href = "index.html"; // Torna al login
}
