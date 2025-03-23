import "./features/char-card/char-card.js";
import * as apiCaller from "/service/api-caller.js";

const isLocal = false;

const campionato = JSON.parse(localStorage.getItem("campionato"));
const chiaveCampionato = campionato.chiaveCampionato;

document.addEventListener("DOMContentLoaded", async function () {
  const user = JSON.parse(localStorage.getItem("user"));
  const campionato = JSON.parse(localStorage.getItem("campionato"));
  const profileContainer = document.querySelector(".profile-name-container");
  const toggleMenu = document.querySelector(".toggle-menu-profile");
  document
    .getElementById("admin-btn")
    .addEventListener("click", goToAdminPanel);

  document
    .getElementById("invita-utente-button")
    .addEventListener("click", openInvitaUtenteModal);

  document.getElementById("logout-button").addEventListener("click", logout);

  profileContainer.addEventListener("click", () => {
    toggleMenu.style.display =
      toggleMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (event) => {
    if (
      !profileContainer.contains(event.target) &&
      !toggleMenu.contains(event.target)
    ) {
      toggleMenu.style.display = "none";
    }
  });

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const username = user.username;

  document.getElementById("user-info").textContent = `${username}`;

  if (campionato.ruoloUtente === "ADMIN" || campionato.ruoloUtente === "OWNER") {
    document.getElementById("admin-btn").style.display = "block";
  }

  if (isLocal) {
    displayCreateForm(username, chiaveCampionato); //MOCK
  } else {
    try {
      const squadraData = await fetchSquadra(username, chiaveCampionato);
      if (squadraData && squadraData.personaggi.length > 0) {
        displaySquadra(squadraData);
      } else {
        displayCreateForm(username, chiaveCampionato);
      }
    } catch (error) {
      console.error("Errore durante il caricamento iniziale:", error);
    }
  }
});

const fetchSquadra = async (username, chiaveCampionato) => {
  return await apiCaller.recuperaSquadra(username, chiaveCampionato);
};

const socket = new SockJS(apiCaller.serverHost + "/ws-endpoint");
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
  console.log("Connesso a STOMP");
  stompClient.subscribe(
    "/topic/azione-personaggio-aggiunta",
    async (message) => {
      const user = JSON.parse(localStorage.getItem("user"));
      const campionato = JSON.parse(localStorage.getItem("campionato"));
      const squadraData = await fetchSquadra(user.username, campionato.chiaveCampionato);
      if (squadraData) {
        displaySquadra(squadraData);
      }
    }
  );
});

function displaySquadra(data) {
  const container = document.getElementById("content");
  container.innerHTML = `
        <div id="squadra-view">
            <h2>${data.squadra.nome}</h2>
            <p>${data.squadra.descrizione}</p>
            <h3>Personaggi:</h3>
            <ul id="personaggi-list"></ul>
            <p>Punteggio Totale: ${data.punteggioSquadra}</p>
        </div>
    `;

  const personaggiList = document.getElementById("personaggi-list");
  data.personaggi.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nomePersonaggio} - ${p.punteggioAttuale}`;
    personaggiList.appendChild(li);
  });
}

async function displayCreateForm(username, chiaveCampionato) {
  const container = document.getElementById("create-form-container");
  container.style.display = "block";

  const personaggi = await apiCaller.recuperaPersonaggi(chiaveCampionato);
  if(personaggi) {
    if (personaggi.length == 0) {
        container.innerHTML = "Nessun personaggio disponibile";
        return;
      }
      populatePersonaggiList(personaggi, username);
  }
}

// Function to populate the UI with personaggi (works for both mock & real data)
async function populatePersonaggiList(personaggi, username) {
  const list = document.getElementById("personaggi-list");
  list.innerHTML = ""; // Pulisce la lista precedente

    let numeroMassimoPersonaggi = 5;


  let selected = [];
  let credits = 160;
  let count = 0;

  personaggi.forEach((p) => {
    const charCard = document.createElement("char-card");
    charCard.setAttribute("chiave", p.chiave);
    charCard.setAttribute("name", p.nominativo);
    charCard.setAttribute("cost", p.costo);
    charCard.setAttribute("selectable", ""); // Abilita la selezione

    // Ascolta l'evento `char-selected` dalla card
    charCard.addEventListener("char-selected", (event) => {
      const { chiave, name, cost, selected: isSelected } = event.detail;

      if (isSelected) {
        if (count < numeroMassimoPersonaggi && credits >= cost) {
          selected.push({ chiave, name, cost });
          credits -= cost;
          count++;
        } else {
          charCard.toggleSelection(true); // Deseleziona se non può essere selezionato
          alert("Crediti insufficienti o limite raggiunto");
        }
      } else {
        selected = selected.filter((c) => c.name !== name);
        credits += cost;
        count--;
      }

      document.getElementById(
        "remaining-credits"
      ).textContent = `Crediti rimanenti: ${credits}`;
      document.getElementById("selected-count").textContent = `${count}/${numeroMassimoPersonaggi}`;

      let personaggiSelezionati = "";
      selected.forEach((personaggio, index) => {
        if (index !== selected.length - 1) {
          personaggiSelezionati = personaggiSelezionati.concat(
            personaggio.name + ", "
          );
        } else {
          personaggiSelezionati = personaggiSelezionati.concat(
            personaggio.name
          );
        }
      });
      document.getElementById(
        "selected-personaggi"
      ).textContent = `Personaggi selezionati: ${personaggiSelezionati}`;

      document.getElementById("create-btn").disabled = !(
        count === numeroMassimoPersonaggi && credits >= 0
      );
    });

    list.appendChild(charCard);
  });

  document.getElementById("create-btn").addEventListener("click", async () => {
    const squadraName = document.getElementById("squadra-name").value;
    const squadraDesc = document.getElementById("squadra-desc").value;
    const nominativi = selected.map((p) => p.chiave);

    const squadra = await apiCaller.creaSquadra(squadraName, squadraDesc, chiaveCampionato, nominativi);
    if(squadra) {
        displaySquadra(data);
    }
  });
}

export async function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("campionato");
  await apiCaller.logOut();
  window.location.href = "index.html";
}

export function goToAdminPanel() {
  window.location.href = "pannello-admin.html";
}

export function openInvitaUtenteModal() {
    document.getElementById('invitaUtenteModal').style.display = 'block';
}

export function closeModal() {
    document.getElementById('invitaUtenteModal').style.display = 'none';
}

export function invitaUtente() {
    const usernameDaInvitare = document.getElementById('usernameUtenteDaInvitare').value;
    await apiCaller.invitaUtente(usernameDaInvitare, 'PLAYER', chiaveCampionato);
    closeModal();
}