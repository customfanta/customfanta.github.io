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
    window.location.href = "index.html";
}
