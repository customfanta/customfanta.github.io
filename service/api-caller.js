export const isLocalValue = window.location.hostname === "" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const serverHost = "https://customfantabe.onrender.com";


export async function creaUtente(username, nome, mail, password) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/create-user";

    return makePost(apiUrl, JSON.stringify({ username, nome, mail, password }));
}

export async function effettuaAccesso(usernameMail, password) {
    const apiUrl = isLocalValue ? "../../mock/api/make-login.json" : serverHost + "/make-login";

    return makePost(apiUrl, JSON.stringify({ usernameMail, password }));
}

export async function recuperaUtenteLoggato() {
    const apiUrl = isLocalValue ? "../../mock/api/get-utente-loggato.json" : serverHost + "/get-utente-loggato";

    return makeGet(apiUrl);
}

export async function logOut() {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/logout";

    return makeGet(apiUrl);
}

export async function cancellaSquadra(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/delete-squadra/" + username + "/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function recuperaPersonaggi(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-personaggi.json" : serverHost + "/read-personaggi/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function creaSquadra(nomeSquadra, descrizioneSquadra, chiaveCampionato, chiaviPersonaggi) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/crea-squadra";

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

export async function invitaUtente(usernameDaInvitare, ruoloInvito, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/invita-utente";

    const body = {
      usernameUtenteInvitato: usernameDaInvitare,
      ruoloInvito: ruoloInvito,
      chiaveCampionato: chiaveCampionato
    };

    return makePost(apiUrl, JSON.stringify(body));
}

export async function recuperaUtentiCampionato(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/utenti-campionato.json" : serverHost + "/utenti-campionato/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function rendiUtenteAdmin(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/make-utente-admin/" + username + "/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function rimuoviUtenteCampionato(username, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/rimuovi-utente-campionato/" + username + "/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function recuperaAzioni(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-all-azioni.json" : serverHost + "/read-all-azioni/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function creaAzione(azione, descrizione, punteggio, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/create-azione";

    return makePost(apiUrl, JSON.stringify({ azione, descrizione, punteggio, chiaveCampionato }));
}

export async function creaPersonaggio(nominativo, descrizione, costo, chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/create-personaggio";

    return makePost(apiUrl, JSON.stringify({ nominativo, descrizione, costo, chiaveCampionato }));
}

export async function aggiungiAzionePersonaggio(chiaveAzione, chiavePersonaggio) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/add-azione-to-personaggio";

    return makePost(apiUrl, JSON.stringify({ chiaveAzione, chiavePersonaggio }));
}

export async function recuperaCampionati() {
    const apiUrl = isLocalValue ? "../../mock/api/campionati-utente.json" : serverHost + "/campionati-utente";

    return makeGet(apiUrl);
}

export async function creaCampionato(nome, descrizione) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/crea-campionato";

    return makePost(apiUrl, JSON.stringify({ nome, descrizione }));
}

export async function recuperaInvitiRicevuti() {
    const apiUrl = isLocalValue ? "../../mock/api/read-inviti-ricevuti.json" : serverHost + "/read-inviti-ricevuti";

    return makeGet(apiUrl);
}

export async function recuperaInvitiInviati() {
    const apiUrl = isLocalValue ? "../../mock/api/read-inviti-inviati.json" : serverHost + "/read-inviti-inviati";

    return makeGet(apiUrl);
}

export async function recuperaInvitiCampionato(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/read-inviti-campionato.json" : serverHost + "/read-inviti-campionato/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function accettaInvito(chiaveInvito) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/accetta-invito/"+ chiaveInvito;

    return makeGet(apiUrl);
}

export async function rifiutaInvito(chiaveInvito) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/rifiuta-invito/"+ chiaveInvito;

    return makeGet(apiUrl);
}

export async function recuperaConfigurazioniCampionato(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/recupera-configurazioni-campionato.json" : serverHost + "/recupera-configurazioni-campionato/" + chiaveCampionato;

    return makeGet(apiUrl);
}

export async function aggiungiConfigurazioneCampionato(chiaveCampionato, chiaveConfigurazione, valoreConfigurazione) {
    const apiUrl = isLocalValue ? "../../mock/api/esito.json" : serverHost + "/aggiungi-configurazione-campionato";

    return makePost(apiUrl, JSON.stringify({ chiaveCampionato, chiaveConfigurazione, valoreConfigurazione }));
}

export async function ricercaUtente(chiaveCampionato, searchParam, options = {}) {
    const apiUrl = isLocalValue ? "../../mock/api/ricerca-utente.json" : serverHost + "/ricerca-utente/" + chiaveCampionato + "?searchParam=" + searchParam;
    return makeGet(apiUrl, options);
}

export async function recuperaSquadreCampionato(chiaveCampionato) {
    const apiUrl = isLocalValue ? "../../mock/api/recupera-squadre-campionato.json" : serverHost + "/recupera-squadre-campionato/" + chiaveCampionato;

    return makeGet(apiUrl);
}
  
export async function makeGet(apiUrl, { signal } = {}) {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      signal
    });
    return response.ok ? await response.json() : null;
}

export async function makePost(apiUrl, body) {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body,
    });

    return response.ok ? await response.json() : null;
}