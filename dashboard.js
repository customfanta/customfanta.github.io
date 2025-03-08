const basePath = "https://customfantabe.onrender.com";
//const basePath = "http://localhost:8080";


document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Accesso non autorizzato. Effettua il login.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("user-info").textContent = `Ciao ${user.username}`;

    if (user.profile === "ADMIN") {
        document.getElementById("admin-btn").style.display = "block";
    }
});


function goToAdminPanel() {
    window.location.href = "pannello-admin.html";
}

function logout() {
    localStorage.removeItem("user");

    const response = await fetch(basePath + '/logout', { method: 'GET', credentials: "include" });
    const data = await response.json();

    window.location.href = "index.html";
}
