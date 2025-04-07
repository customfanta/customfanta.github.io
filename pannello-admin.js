import * as apiCaller from "./service/api-caller.js";

let availableActions = [];
let selectedCharacter = '';


const campionato = JSON.parse(localStorage.getItem("campionato"));

initConfigurazioni();
readAllUser();
readAllActions();
readAllCharacters();
populateCharacterActionTable();
closeModal();

window.readAllUser = readAllUser;
export async function readAllUser() {
    const utentiCampionato = await apiCaller.recuperaUtentiCampionato(campionato.chiaveCampionato);
    if(utentiCampionato) {
        const tableBody = document.querySelector("#user-table tbody");
        tableBody.innerHTML = "";

        utentiCampionato.forEach(user => {
            const row = `<tr>
                <td>${user.usernameUtente}</td>
                <td>${user.ruoloUtente}</td>
                <td><button onclick="deleteUserByIdFromList('${user.usernameUtente}')">❌</button></td>
                <td><button onclick="makeUserAdmin('${user.usernameUtente}')">AddAdmin</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }
}

window.makeUserAdmin = makeUserAdmin;
export async function makeUserAdmin(username) {
    await apiCaller.rendiUtenteAdmin(username, campionato.chiaveCampionato);
    readAllUser();
}

window.deleteUserByIdFromList = deleteUserByIdFromList;
export async function deleteUserByIdFromList(username) {
    await apiCaller.rimuoviUtenteCampionato(username, campionato.chiaveCampionato);
    readAllUser();
}

window.uploadAzioniFile = uploadAzioniFile;
export async function uploadAzioniFile() {
    const fileInput = document.getElementById('fileAzioniInput');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('file', file);

    await apiCaller.uploadAzioni(formData);
    readAllActions();
}

window.toggleButtonAzioniState = toggleButtonAzioniState;
export function toggleButtonAzioniState() {
    const fileInput = document.getElementById('fileAzioniInput');
    const uploadButton = document.getElementById('uploadAzioniButton');
    
    if (fileInput.files.length > 0) {
        uploadButton.removeAttribute('disabled'); // Abilita il pulsante
    } else {
        uploadButton.setAttribute('disabled', 'disabled'); // Disabilita il pulsante
    }
}

window.readAllActions = readAllActions;
export async function readAllActions() {
    availableActions = await apiCaller.recuperaAzioni(campionato.chiaveCampionato);

    if(availableActions) {
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
    }
}

window.createAction = createAction;
export async function createAction(event) {
    event.preventDefault();
    const azione = document.getElementById("new-action-name").value;
    const descrizione = document.getElementById("new-action-description").value;
    const punteggio = document.getElementById("new-action-punteggio").value;

    await apiCaller.creaAzione(azione, descrizione, punteggio, campionato.chiaveCampionato);
    readAllActions();
}

window.readAllCharacters = readAllCharacters;
export async function readAllCharacters() {
    const personaggi = await apiCaller.recuperaPersonaggi(campionato.chiaveCampionato);

    if(personaggi) {
        const tableBody = document.querySelector("#character-table tbody");
        tableBody.innerHTML = "";

        personaggi.forEach(character => {
            const row = `<tr>
                <td>${character.nominativo}</td>
                <td>${character.descrizione}</td>
                <td>${character.costo}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }
}

window.createPersonaggio = createPersonaggio;
export async function createPersonaggio(event) {
    event.preventDefault();
    const nominativo = document.getElementById("new-personaggio-name").value;
    const descrizione = document.getElementById("new-personaggio-description").value;
    const costo = document.getElementById("new-personaggio-costo").value;

    await apiCaller.creaPersonaggio(nominativo, descrizione, costo, campionato.chiaveCampionato);
    readAllCharacters();
}

window.populateCharacterActionTable = populateCharacterActionTable;
export async function populateCharacterActionTable() {
    const personaggi = await apiCaller.recuperaPersonaggi(campionato.chiaveCampionato);

    if(personaggi) {
        const tableBody = document.querySelector("#character-action-table tbody");
        tableBody.innerHTML = "";

        personaggi.forEach(character => {
            const row = `<tr>
                <td>${character.nominativo}</td>
                <td><button onclick="openModal('${character.nominativo}', '${character.chiave}')">+</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } 
}

window.openModal = openModal;
export function openModal(charName, chiavePersonaggio) {
    selectedCharacter = chiavePersonaggio;
    const modalTitle = document.querySelector('#assignModal h3');
    modalTitle.textContent = `Assegna Azione a ${charName}`;
    document.getElementById('assignModal').style.display = 'block';
    populateActionSelect();
}

window.closeModal = closeModal;
export function closeModal() {
    document.getElementById('assignModal').style.display = 'none';
}

window.populateActionSelect = populateActionSelect;
export function populateActionSelect() {
    const select = document.getElementById('action-select');
    select.innerHTML = '<option value="">Seleziona un\'azione</option>';
    availableActions.forEach(action => {
        const option = document.createElement('option');
        option.value = action.chiave;
        option.textContent = action.azione;
        select.appendChild(option);
    });
}

window.assignAction = assignAction;
export async function assignAction() {
    const selectedAction = document.getElementById('action-select').value;
    if (selectedAction) {
        await apiCaller.aggiungiAzionePersonaggio(selectedAction, selectedCharacter);
        closeModal();
    }
}

window.initConfigurazioni = initConfigurazioni;
export async function initConfigurazioni() {
    const configurazioni = await apiCaller.recuperaConfigurazioniCampionato(campionato.chiaveCampionato);

    const numeroPersonaggiPerSquadra = configurazioni.find(config => config.chiaveConfigurazione === "numero-personaggi-per-squadra")?.valoreConfigurazione;
    document.getElementById('numero-personaggi-per-squadra').setAttribute("placeholder", numeroPersonaggiPerSquadra || "5");

    const budgetCrediti = configurazioni.find(config => config.chiaveConfigurazione === "budget-crediti")?.valoreConfigurazione;
    document.getElementById('budget-crediti').setAttribute("placeholder", budgetCrediti || "160");
}

window.aggiornaConfigurazione = aggiornaConfigurazione;
export async function aggiornaConfigurazione() {
    let elementNumPers = document.getElementById('numero-personaggi-per-squadra');
    let numPers = elementNumPers.value;
    if(numPers != "") {
        await apiCaller.aggiungiConfigurazioneCampionato(campionato.chiaveCampionato, 'numero-personaggi-per-squadra', numPers);
    }

    let elementBudgCred = document.getElementById('budget-crediti');
    let budgetCrediti = elementBudgCred.value;
    if(budgetCrediti != "") {
        await apiCaller.aggiungiConfigurazioneCampionato(campionato.chiaveCampionato, 'budget-crediti', budgetCrediti);
    }
}

