const basePath = "https://customfantabe.onrender.com";
//const basePath = "http://localhost:8080";

let availableActions = [];

readAllUser();
readAllActions();
readAllCharacters();

/** Recupera tutti gli utenti */
async function readAllUser() {
    try {
        const response = await fetch(basePath + '/read-all-user');
        const data = await response.json();
        const tableBody = document.querySelector("#user-table tbody");
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = `<tr>
                <td>${user.username}</td>
                <td><button onclick="deleteUserByIdFromList('${user.username}')">❌</button></td>
                <td><button onclick="makeUserAdmin('${user.username}')">AddAdmin</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Errore nel recupero utenti:", error);
    }
}


async function makeUserAdmin(username) {
    try {
        await fetch(basePath + '/make-user-admin/'+ username, { method: 'GET', headers: { 'profilo': 'ADMIN' } });
        readAllUser();
    } catch (error) {
        console.error("Errore nell'eliminazione utente:", error);
    }
}

/** Elimina un utente per ID (dalla tabella) */
async function deleteUserByIdFromList(username) {
    try {
        await fetch(basePath + '/delete-user/'+ username, { method: 'GET', headers: { 'profilo': 'ADMIN' } });
        readAllUser();
    } catch (error) {
        console.error("Errore nell'eliminazione utente:", error);
    }
}

/** Recupera tutte le azioni */
async function readAllActions() {
    try {
        const response = await fetch(basePath + '/read-all-azioni');
        availableActions = await response.json();
        const tableBody = document.querySelector("#action-table tbody");
        tableBody.innerHTML = "";

        availableActions.forEach(action => {
            const row = `<tr>
            <td>${action.azione}</td>
            <td>${action.descrizione}</td>
            <td>${action.punteggio}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Errore nel recupero azioni:", error);
    }
}

/** Crea una nuova azione */
async function createAction(event) {
    event.preventDefault();
    const azione = document.getElementById("new-action-name").value;
    const descrizione = document.getElementById("new-action-description").value;
    const punteggio = document.getElementById("new-action-punteggio").value;

    try {
        await fetch(basePath + '/create-azione', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'profilo': 'ADMIN' },
            body: JSON.stringify({ azione, descrizione, punteggio })
        });
        readAllActions();
    } catch (error) {
        console.error("Errore nella creazione azione:", error);
    }
}

/** Recupera tutti i personaggi */
async function readAllCharacters() {
    try {
        const response = await fetch(basePath + '/read-personaggi');
        const data = await response.json();
        const tableBody = document.querySelector("#character-table tbody");
        tableBody.innerHTML = "";

        data.forEach(character => {
            const row = `<tr>
                <td>${character.nominativo}</td>
                <td>${character.descrizione}</td>
                <td>${character.costo}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Errore nel recupero personaggi:", error);
    }
}

/** Crea un nuovo personaggio */
async function createPersonaggio(event) {
    event.preventDefault();
    const nominativo = document.getElementById("new-personaggio-name").value;
    const descrizione = document.getElementById("new-personaggio-description").value;
    const costo = document.getElementById("new-personaggio-costo").value;

    try {
        await fetch(basePath + '/create-personaggio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'profilo': 'ADMIN' },
            body: JSON.stringify({ nominativo, descrizione, costo })
        });
        readAllCharacters();
    } catch (error) {
        console.error("Errore nella creazione azione:", error);
    }
}

/** Assegna un'azione a un personaggio */
//async function assignAction(characterId) {
//    const selectedAction = document.querySelector(`#action-select-${characterId}`).value;
//
//    try {
//        await fetch(basePath + '/assign-action', {
//            method: 'POST',
//            headers: { 'Content-Type': 'application/json' },
//            body: JSON.stringify({ characterId, actionName: selectedAction })
//        });
//
//        alert("Azione assegnata!");
//    } catch (error) {
//        console.error("Errore nell'assegnazione dell'azione:", error);
//    }
//}
