const isLocalValue = window.location.hostname === "" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const serverHost = "https://customfantabe.onrender.com";


async function creaUtente(username, nome, mail, password) {
    const apiUrl = isLocalValue ? "../../mock/api/create-user.json" : serverHost + "/create-user";

    return makePost(apiUrl, JSON.stringify({ username, nome, mail, password }));
}

async function effettuaAccesso(usernameMail, password) {
    const apiUrl = isLocalValue ? "../../mock/api/make-login.json" : serverHost + "/make-login";

    return makePost(apiUrl, JSON.stringify({ usernameMail, password }));
}

async function recuperaUtenteLoggato() {
    const apiUrl = isLocalValue ? "../../mock/api/get-utente-loggato.json" : serverHost + "/get-utente-loggato";

    return makeGet(apiUrl);
}

async function logOut() {
    const apiUrl = isLocalValue ? "../../mock/api/log-out.json" : serverHost + "/logout";

    return makeGet(apiUrl);
}

async function recuperaSquadra(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-squadra.json" : serverHost + "/read-squadra/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function cancellaSquadra(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/delete-squadra.json" : serverHost + "/delete-squadra/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function recuperaPersonaggi(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-personaggi.json" : serverHost + "/read-personaggi/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function creaSquadra(nomeSquadra, descrizioneSquadra, chiaveCampionato, chiaviPersonaggi) {
    const apiUrl = isLocalValue ? "../../mock/api/crea-squadra.json" : serverHost + "/crea-squadra";

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
    const apiUrl = isLocalValue ? "../../mock/api/invita-utente.json" : serverHost + "/invita-utente";

    const body = {
      usernameUtenteInvitato: usernameDaInvitare,
      ruoloInvito: ruoloInvito,
      chiaveCampionato: chiaveCampionato
    };

    return makePost(apiUrl, JSON.stringify(body));
}

async function recuperaUtentiCampionato(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/utenti-campionato.json" : serverHost + "/utenti-campionato/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function rendiUtenteAdmin(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/make-utente-admin.json" : serverHost + "/make-utente-admin/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function rimuoviUtenteCampionato(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/rimuovi-utente-campionato.json" : serverHost + "/rimuovi-utente-campionato/${username}/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function recuperaAzioni(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-all-azioni.json" : serverHost + "/read-all-azioni/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function creaAzione(azione, descrizione, punteggio, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/create-azione.json" : serverHost + "/create-azione";

    return makePost(apiUrl, JSON.stringify({ azione, descrizione, punteggio, chiaveCampionato }));
}

async function recuperaPersonaggi(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-personaggi.json" : serverHost + "/read-personaggi/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function creaPersonaggio(nominativo, descrizione, costo, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/create-personaggio.json" : serverHost + "/create-personaggio";

    return makePost(apiUrl, JSON.stringify({ nominativo, descrizione, costo, chiaveCampionato }));
}

async function aggiungiAzionePersonaggio(chiaveAzione, chiavePersonaggio) {
    const apiUrl = isLocalValue ? "../../mock/api/add-azione-to-personaggio.json" : serverHost + "/add-azione-to-personaggio";

    return makePost(apiUrl, JSON.stringify({ chiaveAzione, chiavePersonaggio }));
}

async function recuperaCampionati() {
    const apiUrl = isLocalValue ? "../../mock/api/campionati-utente.json" : serverHost + "/campionati-utente";

    return makeGet(apiUrl);
}

async function creaCampionato(nome, descrizione) {
    const apiUrl = isLocalValue ? "../../mock/api/crea-campionato.json" : serverHost + "/crea-campionato";

    return makePost(apiUrl, JSON.stringify({ nome, descrizione }));
}

async function recuperaInvitiRicevuti() {
    const apiUrl = isLocalValue ? "../../mock/api/read-inviti-ricevuti.json" : serverHost + "/read-inviti-ricevuti";

    return makeGet(apiUrl);
}

async function recuperaInvitiInviati() {
    const apiUrl = isLocalValue ? "../../mock/api/read-inviti-inviati.json" : serverHost + "/read-inviti-inviati";

    return makeGet(apiUrl);
}

async function recuperaInvitiCampionato(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-inviti-campionato.json" : serverHost + "/read-inviti-campionato/${chiaveCampionato}";

    return makeGet(apiUrl);
}

async function accettaInvito(chiaveInvito) {
    const apiUrl = isLocalValue ? "../../mock/api/accetta-invito.json" : serverHost + "/accetta-invito/${chiaveInvito}";

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