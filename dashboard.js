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

  let allSquadreResponse;
  let squadraData;
    try {
      allSquadreResponse = await apiCaller.recuperaSquadreCampionato(chiaveCampionato);
      squadraData = allSquadreResponse.find(squadra => squadra.laMiaSquadra);
    } catch (error) {
    }

    if (squadraData && squadraData.personaggi.length > 0) {
      displaySquadra(allSquadreResponse, squadraData);
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
        try {
          const allSquadreResponse = await apiCaller.recuperaSquadreCampionato(chiaveCampionato);
          const squadraData = allSquadreResponse.find(squadra => squadra.laMiaSquadra);
          if (squadraData) {
            displaySquadra(allSquadreResponse, squadraData);
          }
        } catch(error) {}
      }
    );
  });
}

window.displaySquadra = displaySquadra;
export async function displaySquadra(allSquadreResponse, data) {
    document.getElementById("logo-nome-campionato").textContent = getInitials(campionato.nomeCampionato);
  document.getElementById("nome-campionato").textContent = campionato.nomeCampionato;

  document.getElementById("main-team").innerHTML =
  `
    <div class="row row-1">
			<div class="position-badge">${data.posizioneClassifica}°</div>
			<div class="team-icon">${getInitials(data.squadra.nome)}</div>
			<div class="team-name">${data.squadra.nome}</div>
			<div class="team-points">${data.punteggioSquadra} pt</div>
		</div>
		
		<div class="row row-2">
			  <div class="team-username">${data.squadra.usernameUtente}</div>
			  <div id="team-members" class="team-members">
			  </div>
		</div>
  `;

  let teamMembersElement = document.getElementById("team-members");

  data.personaggi.forEach((p) => {
    let teamMemberElement = document.createElement("div");
    teamMemberElement.setAttribute("class", "team-member-icon");
    teamMemberElement.textContent = getInitials(p.nomePersonaggio);

    teamMemberElement.dataset.nome = p.nomePersonaggio;
    teamMemberElement.dataset.punteggio = p.punteggioAttuale;

    teamMemberElement.addEventListener('mouseover', (event) => {
      showTooltip(
        event.target,
        teamMemberElement.dataset.nome,
        teamMemberElement.dataset.punteggio
      );
    });
    teamMemberElement.addEventListener('mouseout', hideTooltip);

    teamMembersElement.appendChild(teamMemberElement);
  });



  let bottomTeamGrid = document.getElementById("bottom-team-grid");
  bottomTeamGrid.innerHTML = ``;

  allSquadreResponse.forEach((s) => {
    let teamOfGridElement = document.createElement("div");
    teamOfGridElement.setAttribute("class", "bottom-team-item");

    let row1El = document.createElement("div");
    row1El.setAttribute("class", "row row-1");
      let posBadEl = document.createElement("div");
      posBadEl.setAttribute("class", "position-badge");
      posBadEl.textContent = `${s.posizioneClassifica}°`;
      row1El.appendChild(posBadEl);

      let teamIconEl = document.createElement("div");
      teamIconEl.setAttribute("class", "team-icon");
      teamIconEl.textContent = getInitials(s.squadra.nome);
      row1El.appendChild(teamIconEl);

      let teamNameEl = document.createElement("div");
      teamNameEl.setAttribute("class", "team-name");
      teamNameEl.textContent = s.squadra.nome;
      row1El.appendChild(teamNameEl);

      let teamPointsEl = document.createElement("div");
      teamPointsEl.setAttribute("class", "team-points");
      teamPointsEl.textContent = `${s.punteggioSquadra} pt`;
      row1El.appendChild(teamPointsEl);
    teamOfGridElement.appendChild(row1El);

    let row2El = document.createElement("div");
    row2El.setAttribute("class", "row row-2");
      let usernEl = document.createElement("div");
      usernEl.setAttribute("class", "team-username");
      usernEl.textContent = s.squadra.usernameUtente;
      row2El.appendChild(usernEl);

      let teamMembersEl = document.createElement("div");
      teamMembersEl.setAttribute("class", "team-members");
        s.personaggi.forEach((p) => {
          let teamMemberEl = document.createElement("div");
          teamMemberEl.setAttribute("class", "team-member-icon");
          teamMemberEl.textContent = getInitials(p.nomePersonaggio);

          teamMemberEl.dataset.nome = p.nomePersonaggio;
          teamMemberEl.dataset.punteggio = p.punteggioAttuale;

          teamMemberEl.addEventListener('mouseover', (event) => {
            showTooltip(
              event.target,
              teamMemberEl.dataset.nome,
              teamMemberEl.dataset.punteggio
            );
          });
          teamMemberEl.addEventListener('mouseout', hideTooltip);

          teamMembersEl.appendChild(teamMemberEl);
        });
      row2El.appendChild(teamMembersEl);
    teamOfGridElement.appendChild(row2El);
    bottomTeamGrid.appendChild(teamOfGridElement);
  });
  
  document.getElementById("new-content").removeAttribute("style");
}

window.getInitials = getInitials;
export function getInitials(str) {
  return str
    .trim()                     // Rimuove spazi iniziali e finali
    .split(' ')                 // Dividi la stringa in parole
    .filter(word => word)       // Rimuovi eventuali parole vuote (es. da spazi multipli)
    .map(word => word[0].toUpperCase()) // Prendi la prima lettera maiuscola di ogni parola
    .join('');                  // Unisci le iniziali in una stringa
}


const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
document.body.appendChild(tooltip);

window.showTooltip = showTooltip;
export function showTooltip(element, nome, punteggio) {
  tooltip.textContent = `${nome} con ${punteggio} pt`;
  tooltip.style.display = 'block';

  // Posiziona il tooltip sotto l'icona
  const rect = element.getBoundingClientRect();
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
  let top = rect.bottom + 5; // 5px sotto l'icona

  // Se il tooltip esce dallo schermo, lo posiziona sopra
  if (top + tooltipHeight > window.innerHeight) {
    top = rect.top - tooltipHeight - 5;
  }

  const bodyMarginTop = parseInt(getComputedStyle(document.body).marginTop) || 0;

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

window.hideTooltip = hideTooltip;
export function hideTooltip() {
  tooltip.style.display = 'none';
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

    let allSquadreResponse;
    let squadraData;
    try {
      allSquadreResponse = await apiCaller.recuperaSquadreCampionato(chiaveCampionato);
      squadraData = allSquadreResponse.find(squadra => squadra.laMiaSquadra);
    } catch (error) {
    }

    if (squadraData && squadraData.personaggi.length > 0) {
      displaySquadra(allSquadreResponse, squadraData);
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

    apiCaller.ricercaUtente(chiaveCampionato, searchTerm, { signal })
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