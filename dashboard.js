import "./features/char-card/char-card.js";

const basePath = window.location.hostname === "" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:8080" : "https://customfantabe.onrender.com";

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
    alert("Accesso non autorizzato. Effettua il login.");
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
  if (isLocal) {
    return {
      squadra: {
        nome: "Mock Team",
        descrizione: "Squadra generata",
      },
      punteggioSquadra: 2000,
      personaggi: [
        { nomePersonaggio: "Personaggio Test 1", punteggioAttuale: 400 },
        { nomePersonaggio: "Personaggio Test 2", punteggioAttuale: 450 },
      ],
    };
  }

  try {
    const response = await fetch(`${basePath}/read-squadra/${username}/${chiaveCampionato}`, {
      method: "GET",
      credentials: "include",
    });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Errore durante il recupero della squadra:", error);
    return null;
  }
};

const socket = new SockJS(basePath + "/ws-endpoint");
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

function displayCreateForm(username, chiaveCampionato) {
  const container = document.getElementById("create-form-container");
  container.style.display = "block";

  if (isLocal) {
    console.log("⚠️ Running in LOCAL mode - Using Mock Data ⚠️");
    const personaggi = [
      { nominativo: "Personaggio Test 1", costo: 50 },
      { nominativo: "Personaggio Test 2", costo: 20 },
      { nominativo: "Personaggio Test 3", costo: 10 },
      { nominativo: "Personaggio Test 4", costo: 30 },
      { nominativo: "Personaggio Test 5", costo: 60 },
      { nominativo: "Personaggio Test 6", costo: 40 },
      { nominativo: "Personaggio Test 7", costo: 50 },
      { nominativo: "Personaggio Test 8", costo: 80 },
    ];
    populatePersonaggiList(personaggi, username);
  } else {
    console.log("🌍 Running in PRODUCTION mode - Fetching Real Data 🌍");
    fetch(`${basePath}/read-personaggi/${chiaveCampionato}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((personaggi) => {
        if (personaggi.length === 0) {
          container.innerHTML = "Nessun personaggio disponibile";
          return;
        }
        populatePersonaggiList(personaggi, username);
      })
      .catch((error) => {
        console.error("Errore durante il recupero dei personaggi:", error);
      });
  }
}

// Function to populate the UI with personaggi (works for both mock & real data)
function populatePersonaggiList(personaggi, username) {
  const list = document.getElementById("personaggi-list");
  list.innerHTML = ""; // Pulisce la lista precedente

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
        if (count < 5 && credits >= cost) {
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
      document.getElementById("selected-count").textContent = `${count}/5`;

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
        count === 5 && credits >= 0
      );
    });

    list.appendChild(charCard);
  });

  document.getElementById("create-btn").addEventListener("click", () => {
    const squadraName = document.getElementById("squadra-name").value;
    const squadraDesc = document.getElementById("squadra-desc").value;
    const nominativi = selected.map((p) => p.chiave);

    const body = {
      squadra: {
        nome: squadraName,
        descrizione: squadraDesc,
        chiaveCampionato: chiaveCampionato,
      },
      chiaviPersonaggi: nominativi,
    };

    if (isLocal) {
      console.log("🛠 Mocked Squad Creation:", body);
      setTimeout(() => {
        alert("Squadra creata con successo! (Mock)");
        displaySquadra({
          squadra: {
            nome: squadraName,
            descrizione: squadraDesc,
          },
          punteggioSquadra: 0,
          personaggi: selected.map((p) => ({
            nomePersonaggio: p.name,
            punteggioAttuale: 0,
          })),
        });
      }, 1000);
    } else {
      fetch(`${basePath}/crea-squadra`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      })
        .then(() => fetchSquadra(username, chiaveCampionato))
        .then((data) =>
          data ? displaySquadra(data) : alert("Errore creazione")
        )
        .catch((error) => console.error("Errore:", error));
    }
  });
}

// Funzioni già presenti nel tuo codice
export async function logout() {
  localStorage.removeItem("user");
  const response = await fetch(basePath + "/logout", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  window.location.href = "index.html";
}

export function goToAdminPanel() {
  window.location.href = "pannello-admin.html";
}


export function openInvitaUtenteModal() {
    document.getElementById('invitaUtenteModal').style.display = 'block';
}

window.closeModal = closeModal;

function closeModal() {
    document.getElementById('invitaUtenteModal').style.display = 'none';
}

window.invitaUtente = invitaUtente;

function invitaUtente() {
    const usernameDaInvitare = document.getElementById('usernameUtenteDaInvitare').value;

    const body = {
      usernameUtenteInvitato: usernameDaInvitare,
      ruoloInvito: 'PLAYER',
      chiaveCampionato: chiaveCampionato
    };

    fetch(`${basePath}/invita-utente`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
          })

    closeModal();
}