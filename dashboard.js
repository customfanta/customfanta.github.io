import "./features/char-card/char-card.js";
import * as apiCaller from "/service/api-caller.js";

const campionato = JSON.parse(localStorage.getItem("campionato"));
const chiaveCampionato = campionato.chiaveCampionato;

closeModal();

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

  let squadraData;
    try {
      squadraData = await fetchSquadra(username, chiaveCampionato);
    } catch (error) {
    }

    if (squadraData && squadraData.personaggi.length > 0) {
      displaySquadra(squadraData);
    } else {
      displayCreateForm(username, chiaveCampionato);
    }
    
});

const fetchSquadra = async (username, chiaveCampionato) => {
  return await apiCaller.recuperaSquadra(username, chiaveCampionato);
};

if(!apiCaller.isLocalValue) {
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
}

window.displaySquadra = displaySquadra;
export async function displaySquadra(data) {
  const container = document.getElementById("content");
  container.innerHTML = `
        <div id="squadra-view">
            <h1>La tua Squadra</h1>
            <h2>${data.squadra.nome}</h2>
            <p>${data.squadra.descrizione}</p>
            <h3>Personaggi:</h3>
            <ul id="personaggi-list"></ul>
            <p>Punteggio Totale: ${data.punteggioSquadra}</p>
        </div>
        <div id="all-squadre-view">
            <h1>Le altre squadre</h2>
        </div>
    `;

  const personaggiList = document.getElementById("personaggi-list");
  data.personaggi.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nomePersonaggio} con ${p.punteggioAttuale} punti`;
    personaggiList.appendChild(li);
  });

  const allSquadreResponse = await apiCaller.recuperaSquadreCampionato(chiaveCampionato);

  const allSquadreList = document.getElementById("all-squadre-view");
  
  allSquadreResponse.forEach((s) => {
    if(!s.laMiaSquadra) {
      let squadraDiv = document.createElement("div");
      allSquadreList.appendChild(squadraDiv);

      let h2El = document.createElement("h2");
      h2El.textContent = `${s.squadra.nome} di ${s.squadra.usernameUtente}`;
      squadraDiv.appendChild(h2El);

      let pEl = document.createElement("p");
      pEl.textContent = s.squadra.descrizione;
      squadraDiv.appendChild(pEl);

      let h3El = document.createElement("h3");
      h3El.textContent = "Personaggi:";
      squadraDiv.appendChild(h3El);

      let persSquadUl = document.createElement("ul");
      squadraDiv.appendChild(persSquadUl);
      s.personaggi.forEach((p) => {
        const li = document.createElement("li");
        li.textContent = `${p.nomePersonaggio} con ${p.punteggioAttuale} punti`;
        persSquadUl.appendChild(li);
      });

      let punteggioTotaleEl = document.createElement("p");
      punteggioTotaleEl.textContent = `Punteggio Totale: ${s.punteggioSquadra}`;
      squadraDiv.appendChild(punteggioTotaleEl);
    }
  });
}

window.displayCreateForm = displayCreateForm;
export async function displayCreateForm(username, chiaveCampionato) {
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

window.populatePersonaggiList = populatePersonaggiList;
export async function populatePersonaggiList(personaggi, username) {
  const list = document.getElementById("personaggi-list");


  list.innerHTML = ""; // Pulisce la lista precedente

  const configurazioni = await apiCaller.recuperaConfigurazioniCampionato(campionato.chiaveCampionato);

  let numeroMassimoPersonaggi = parseInt(configurazioni.find(config => config.chiaveConfigurazione === "numero-personaggi-per-squadra")?.valoreConfigurazione, 10);
  if(!numeroMassimoPersonaggi) {
    numeroMassimoPersonaggi = 5;
  }

  let credits = parseInt(configurazioni.find(config => config.chiaveConfigurazione === "budget-crediti")?.valoreConfigurazione, 10);
  if(!credits) {
    credits = 160;
  }

  let selected = [];
  let count = 0;

  document.getElementById("remaining-credits").textContent = `Crediti rimanenti: ${credits}`;
  document.getElementById("selected-count").textContent = `${count}/${numeroMassimoPersonaggi}`;

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

      document.getElementById("remaining-credits").textContent = `Crediti rimanenti: ${credits}`;
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

    let squadraData;
    try {
      squadraData = await fetchSquadra(username, chiaveCampionato);
    } catch (error) {
    }

    if (squadraData && squadraData.personaggi.length > 0) {
      displaySquadra(squadraData);
    }
  });
}

window.logout = logout;
export async function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("campionato");
  await apiCaller.logOut();
  window.location.href = "index.html";
}

window.goToAdminPanel = goToAdminPanel;
export function goToAdminPanel() {
  window.location.href = "pannello-admin.html";
}

window.openInvitaUtenteModal = openInvitaUtenteModal;
export function openInvitaUtenteModal() {
    document.getElementById('invitaUtenteModal').style.display = 'block';
}

window.closeModal = closeModal;
export function closeModal() {
    document.getElementById('invitaUtenteModal').style.display = 'none';
}

window.invitaUtente = invitaUtente;
export async function invitaUtente() {
    const usernameDaInvitare = document.getElementById('usernameUtenteDaInvitare').value.trim();
    await apiCaller.invitaUtente(usernameDaInvitare, 'PLAYER', chiaveCampionato);
    closeModal();
}




let currentRequest = null;

window.handleSearchInput = handleSearchInput;
export function handleSearchInput(searchTerm) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";

  if (searchTerm.length >= 3) {
    if (currentRequest) {
      currentRequest.abort();
    }

    currentRequest = new AbortController();
    const signal = currentRequest.signal;

    apiCaller.ricercaUtente(searchTerm, { signal })
      .then(data => {
        if (data && data.length > 0) {
          displaySearchResults(data);
        } else {
          searchResults.innerHTML = "<div>Nessun utente trovato</div>";
        }
      })
      .catch(error => {
        if (error.name !== "AbortError") {
          console.error("Errore durante la ricerca:", error);
        }
      });
  }
}

function displaySearchResults(results) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";

  results.forEach(user => {
    const div = document.createElement("div");
    div.textContent = user.username;
    div.onclick = () => {
      document.getElementById("usernameUtenteDaInvitare").value = user.username;
      searchResults.innerHTML = "";
    };
    searchResults.appendChild(div);
  });
}