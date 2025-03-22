const isLocal = window.location.hostname === "" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const basePath = "https://customfantabe.onrender.com";


async function creaUtente(username, nome, mail, password) {
    const apiUrl = isLocal ? "../../mock/api/create-user.json" : basePath + "/create-user";

    return makePost(apiUrl, JSON.stringify({ username, nome, mail, password }));
}

async function effettuaAccesso(usernameMail, password) {
    const apiUrl = isLocal ? "../../mock/api/make-login.json" : basePath + "/make-login";

    return makePost(apiUrl, JSON.stringify({ usernameMail, password }));
}

async function recuperaUtenteLoggato() {
    const apiUrl = isLocal ? "../../mock/api/get-utente-loggato.json" : basePath + "/get-utente-loggato";

    return makeGet(apiUrl);
}

async function makeGet(apiUrl) {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    });

    return await response.json();
}

async function makePost(apiUrl, body) {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body,
    });

    return await response.json();
}