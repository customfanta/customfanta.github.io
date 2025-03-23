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

async function logOut() {
    const apiUrl = isLocal ? "../../mock/api/log-out.json" : basePath + "/logout";

    return makeGet(apiUrl);
}

async function recuperaSquadra(username, chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/read-squadra.json" : basePath + "/read-squadra/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function recuperaPersonaggi(chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/read-personaggi.json" : basePath + "/read-personaggi/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function creaSquadra(nomeSquadra, descrizioneSquadra, chiaveCampionato, chiaviPersonaggi) {
    const apiUrl = isLocal ? "../../mock/api/crea-squadra.json" : basePath + "/crea-squadra";

    const body = {
      squadra: {
        nome: nomeSquadra,
        descrizione: descrizioneSquadra,
        chiaveCampionato: chiaveCampionato,
      },
      chiaviPersonaggi: chiaviPersonaggi,
    };

    return makePost(apiUrl, JSON.stringify(body));
}

async function invitaUtente(usernameDaInvitare, ruoloInvito, chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/invita-utente.json" : basePath + "/invita-utente";

    const body = {
      usernameUtenteInvitato: usernameDaInvitare,
      ruoloInvito: ruoloInvito,
      chiaveCampionato: chiaveCampionato
    };

    return makePost(apiUrl, JSON.stringify(body));
}

async function recuperaUtentiCampionato(chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/utenti-campionato.json" : basePath + "/utenti-campionato/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function rendiUtenteAdmin(username, chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/make-utente-admin.json" : basePath + "/make-utente-admin/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function rimuoviUtenteCampionato(username, chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/rimuovi-utente-campionato.json" : basePath + "/rimuovi-utente-campionato/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function recuperaAzioni(chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/read-all-azioni.json" : basePath + "/read-all-azioni/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function creaAzione(azione, descrizione, punteggio, chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/create-azione.json" : basePath + "/create-azione";

    return makePost(apiUrl, JSON.stringify({ azione, descrizione, punteggio, chiaveCampionato }));
}

async function recuperaPersonaggi(chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/read-personaggi.json" : basePath + "/read-personaggi/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function creaPersonaggio(nominativo, descrizione, costo, chiaveCampionato) {
    const apiUrl = isLocal ? "../../mock/api/create-personaggio.json" : basePath + "/create-personaggio";

    return makePost(apiUrl, JSON.stringify({ nominativo, descrizione, costo, chiaveCampionato }));
}

async function aggiungiAzionePersonaggio(chiaveAzione, chiavePersonaggio) {
    const apiUrl = isLocal ? "../../mock/api/add-azione-to-personaggio.json" : basePath + "/add-azione-to-personaggio";

    return makePost(apiUrl, JSON.stringify({ chiaveAzione, chiavePersonaggio }));
}

async function recuperaCampionati() {
    const apiUrl = isLocal ? "../../mock/api/campionati-utente.json" : basePath + "/campionati-utente";

    return makeGet(apiUrl);
}

async function creaCampionato(nome, descrizione) {
    const apiUrl = isLocal ? "../../mock/api/crea-campionato.json" : basePath + "/crea-campionato";

    return makePost(apiUrl, JSON.stringify({ nome, descrizione }));
}

async function recuperaInvitiRicevuti() {
    const apiUrl = isLocal ? "../../mock/api/read-inviti-ricevuti.json" : basePath + "/read-inviti-ricevuti";

    return makeGet(apiUrl);
}

async function accettaInvito(chiaveInvito) {
    const apiUrl = isLocal ? "../../mock/api/accetta-invito.json" : basePath + "/accetta-invito/${chiaveInvito}";

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