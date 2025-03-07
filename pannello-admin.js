let availableActions = [];

readAllUser();
readAllActions();
readAllCharacters();

/** Recupera tutti gli utenti */
async function readAllUser() {
    try {
        const response = await fetch('https://customfantabe.onrender.com/read-all-user');
        const data = await response.json();
        const tableBody = document.querySelector("#user-table tbody");
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = `<tr>
                <td>${user.username}</td>
                <td><button onclick="deleteUserByIdFromList('${user.username}')">❌</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Errore nel recupero utenti:", error);
    }
}

/** Elimina un utente per ID (dal form) */
async function deleteUserById(event) {
    event.preventDefault();
    const username = document.getElementById("usernameToDelete").value;
    deleteUserByIdFromList(username);
}

/** Elimina un utente per ID (dalla tabella) */
async function deleteUserByIdFromList(username) {
    try {
        await fetch('https://customfantabe.onrender.com/delete-user/'+ username, { method: 'GET', headers: { 'profilo': 'ADMIN' } });
        alert("Utente eliminato!");
        readAllUser();
    } catch (error) {
        console.error("Errore nell'eliminazione utente:", error);
    }
}

/** Elimina tutti gli utenti */
async function deleteAllUser() {
    try {
        await fetch('https://customfantabe.onrender.com/delete-all-user', { method: 'GET', headers: { 'profilo': 'ADMIN' } });
        alert("Tutti gli utenti eliminati!");
        readAllUser();
    } catch (error) {
        console.error("Errore nell'eliminazione utenti:", error);
    }
}

/** Recupera tutte le azioni */
async function readAllActions() {
    try {
        const response = await fetch('https://customfantabe.onrender.com/read-all-azioni');
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
        await fetch('https://customfantabe.onrender.com/create-azione', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'profilo': 'ADMIN' },
            body: JSON.stringify({ azione, descrizione, punteggio })
        });

        alert("Azione creata!");
        readAllActions();
    } catch (error) {
        console.error("Errore nella creazione azione:", error);
    }
}

/** Recupera tutti i personaggi */
async function readAllCharacters() {
    try {
        const response = await fetch('https://customfantabe.onrender.com/read-personaggi');
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
        await fetch('https://customfantabe.onrender.com/create-personaggio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'profilo': 'ADMIN' },
            body: JSON.stringify({ nominativo, descrizione, costo })
        });

        alert("Personaggio creato!");
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
//        await fetch('https://customfantabe.onrender.com/assign-action', {
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
