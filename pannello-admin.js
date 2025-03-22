const basePath = window.location.hostname === "" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:8080" : "https://customfantabe.onrender.com";



let availableActions = [];
let selectedCharacter = '';


const campionato = JSON.parse(localStorage.getItem("campionato"));

readAllUser();
readAllActions();
readAllCharacters();
populateCharacterActionTable();
closeModal();

/** Recupera tutti gli utenti */
async function readAllUser() {
    try {
        const response = await fetch(basePath + '/utenti-campionato/' + campionato.chiaveCampionato, { method: 'GET', credentials: "include" });
        const data = await response.json();
        const tableBody = document.querySelector("#user-table tbody");
        tableBody.innerHTML = "";

        data.forEach(user => {
            const row = `<tr>
                <td>${user.usernameUtente}</td>
                <td>${user.ruoloUtente}</td>
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
        await fetch(basePath + '/make-utente-admin/'+ username + '/' + campionato.chiaveCampionato, { method: 'GET', credentials: "include" });
        readAllUser();
    } catch (error) {
        console.error("Errore nell'eliminazione utente:", error);
    }
}

async function deleteUserByIdFromList(username) {
    try {
        await fetch(basePath + '/rimuovi-utetente-campionato/'+ username + '/' + campionato.chiaveCampionato, { method: 'GET', credentials: "include" });
        readAllUser();
    } catch (error) {
        console.error("Errore nell'eliminazione utente:", error);
    }
}

/** Recupera tutte le azioni */
async function readAllActions() {
    try {
        const response = await fetch(basePath + '/read-all-azioni/' + campionato.chiaveCampionato, { method: 'GET', credentials: "include" });
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
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ azione, descrizione, punteggio, chiaveCampionato: campionato.chiaveCampionato })
        });
        readAllActions();
    } catch (error) {
        console.error("Errore nella creazione azione:", error);
    }
}

/** Recupera tutti i personaggi */
async function readAllCharacters() {
    try {
        const response = await fetch(basePath + '/read-personaggi/' + campionato.chiaveCampionato, { method: 'GET', credentials: "include" });
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
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nominativo, descrizione, costo, chiaveCampionato: campionato.chiaveCampionato })
        });
        readAllCharacters();
    } catch (error) {
        console.error("Errore nella creazione azione:", error);
    }
}


    async function populateCharacterActionTable() {
        try {
            const response = await fetch(basePath + '/read-personaggi/' + campionato.chiaveCampionato, { method: 'GET', credentials: "include" });
            const data = await response.json();
            const tableBody = document.querySelector("#character-action-table tbody");
            tableBody.innerHTML = "";

            data.forEach(character => {
                const row = `<tr>
                    <td>${character.nominativo}</td>
                    <td><button onclick="openModal('${character.nominativo}', '${character.chiave}')">+</button></td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        } catch (error) {
            console.error("Errore nel recupero personaggi:", error);
        }
    }

    function openModal(charName, chiavePersonaggio) {
        selectedCharacter = chiavePersonaggio;
        const modalTitle = document.querySelector('#assignModal h3');
        modalTitle.textContent = `Assegna Azione a ${charName}`;
        document.getElementById('assignModal').style.display = 'block';
        populateActionSelect();
    }

    function closeModal() {
        document.getElementById('assignModal').style.display = 'none';
    }

    function populateActionSelect() {
        const select = document.getElementById('action-select');
        select.innerHTML = '<option value="">Seleziona un\'azione</option>';
        availableActions.forEach(action => {
            const option = document.createElement('option');
            option.value = action.chiave;
            option.textContent = action.azione;
            select.appendChild(option);
        });
    }

    async function assignAction() {
        const selectedAction = document.getElementById('action-select').value;
        if (selectedAction) {
            try {
                await fetch(basePath + '/add-azione-to-personaggio', {
                    method: 'POST',
                    credentials: "include",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chiaveAzione: selectedAction, chiavePersonaggio: selectedCharacter})
                });
            } catch (error) {
                console.error("Errore nella assegnazione dell'azione:", error);
            }
            closeModal();
        }
    }