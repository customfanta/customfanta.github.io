const basePath =
  window.location.hostname === "" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://customfantabe.onrender.com";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  alert("Accesso non autorizzato. Effettua il login.");
  window.location.href = "../../index.html";
}

const socket = new SockJS(basePath + "/ws-endpoint");
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
  console.log("Connesso a STOMP");
  stompClient.subscribe(
    "/topic/nuovo-invito-ricevuto/" + user.username,
    async (message) => {
      init();
    }
  );
});

const profileContainer = document.querySelector(".profile-name-container");
const toggleMenu = document.querySelector(".toggle-menu-profile");

document.getElementById("logout-button").addEventListener("click", logout);

profileContainer.addEventListener("click", () => {
  toggleMenu.style.display =
    toggleMenu.style.display === "flex" ? "none" : "flex";
});

const username = user.username;

document.getElementById("user-info").textContent = `${username}`;

// Recupera l'utente loggato
async function getLoggedUser() {
  const isLocal = basePath === "http://localhost:8080";

  const apiUrl = isLocal
    ? "../../mock/api/get-utente-loggato.json"
    : basePath + "/get-utente-loggato";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero dell'utente loggato:", error);
    return null;
  }
}

// Ottiene la lista dei campionati dell'utente
async function getCampionati() {
  const isLocal = basePath === "http://localhost:8080";

  const apiUrl = isLocal
    ? "../../mock/api/get-campionati.json"
    : basePath + "/campionati-utente";

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
    });

    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero dei campionati:", error);
    return [];
  }
}

// Crea un nuovo campionato
async function createCampionato(nome, descrizione) {
  const campionato = { nome, descrizione };

  try {
    const response = await fetch(`${basePath}/crea-campionato`, {
      method: "POST",
      headers: { "Content-Type": "application/json", credentials: "include" },
      credentials: "include",
      body: JSON.stringify(campionato),
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Errore nella creazione del campionato");
    }
  } catch (error) {
    console.error("Errore durante la creazione del campionato:", error);
    return null;
  }
}

// Funzione per creare la tabella dei campionati
function createTable(campionati, mailCertificata) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Intestazioni tabella
  const headers = ["Nome", "Descrizione", "Owner", "Ruolo"];
  if (mailCertificata) {
    headers.push("Accedi");
  }

  const headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  campionati.forEach((campionato) => {
    const row = document.createElement("tr");

    // Crea le celle normali
    const nomeTd = document.createElement("td");
    nomeTd.textContent = campionato.nomeCampionato;
    row.appendChild(nomeTd);

    const descrizioneTd = document.createElement("td");
    descrizioneTd.textContent = campionato.descrizioneCampionato;
    row.appendChild(descrizioneTd);

    const ownerTd = document.createElement("td");
    ownerTd.textContent = campionato.ownerCampionato;
    row.appendChild(ownerTd);

    const ruoloTd = document.createElement("td");
    ruoloTd.textContent = campionato.ruoloUtente;
    row.appendChild(ruoloTd);

    if (mailCertificata) {
      const buttonTd = document.createElement("td");
      const button = document.createElement("button");
      button.textContent = "Apri";

      button.onclick = () => {
        localStorage.setItem("campionato", JSON.stringify(campionato));
        window.location.href = "../../dashboard.html";
      };

      buttonTd.appendChild(button);
      row.appendChild(buttonTd);
    }

    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  return table;
}

// Funzione per creare il form di creazione
function createForm(username) {
  const form = document.createElement("form");
  form.className = "create-form";

  // Input Nome
  const nomeLabel = document.createElement("label");
  nomeLabel.textContent = "Nome:";
  const nomeInput = document.createElement("input");
  nomeInput.type = "text";
  nomeInput.name = "nome";
  nomeInput.required = true;
  nomeLabel.appendChild(nomeInput);

  // Input Descrizione
  const descrizioneLabel = document.createElement("label");
  descrizioneLabel.textContent = "Descrizione:";
  const descrizioneInput = document.createElement("input");
  descrizioneInput.type = "text";
  descrizioneInput.name = "descrizione";
  descrizioneInput.required = true;
  descrizioneLabel.appendChild(descrizioneInput);

  // Bottone submit
  const submitButton = document.createElement("button");
  submitButton.textContent = "Crea Campionato";
  submitButton.type = "submit";

  // Aggiungi elementi al form
  form.appendChild(nomeLabel);
  form.appendChild(descrizioneLabel);
  form.appendChild(submitButton);

  // Gestore per il submit del form
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = nomeInput.value;
    const descrizione = descrizioneInput.value;

    if (!nome || !descrizione) return;

    const nuovoCampionato = await createCampionato(nome, descrizione);

    if (nuovoCampionato) {
      // Aggiorna la tabella
      const campionati = await getCampionati();
      const table = createTable(campionati, true);
      document
        .getElementById("table-container")
        .replaceChild(
          table,
          document.getElementById("table-container").firstChild
        );

      // Pulisci il form
      nomeInput.value = "";
      descrizioneInput.value = "";
    }
  });

  return form;
}

async function init() {
  const user = await getLoggedUser();
  if (!user) {
    console.error("Utente non trovato");
    return;
  }

  const campionati = await getCampionati();
  const inviti = await getInvitiRicevuti();

  let container = document.getElementById("main-container");
  if (container) {
    container.innerHTML = ""; // Pulisce il contenuto esistente
  } else {
    container = document.createElement("div");
    container.id = "main-container";
    document.body.appendChild(container); // Aggiunge il contenitore solo se non esiste
  }

  // Crea form
  if (user.mailCertificata) {
    const form = createForm(user.username);
    container.appendChild(form);
  }

  // Crea tabella campionati
  const tableContainer = document.createElement("div");
  tableContainer.id = "table-container";
  const campionatiTable = createTable(campionati, user.mailCertificata);
  tableContainer.appendChild(campionatiTable);
  container.appendChild(tableContainer);

  // Crea sezione per gli inviti
  const invitiSection = document.createElement("div");
  invitiSection.className = "inviti-section";

  const invitiHeader = document.createElement("h2");
  invitiHeader.textContent = "Inviti ricevuti";
  invitiSection.appendChild(invitiHeader);

  const invitiTable = createInvitiTable(inviti);
  invitiSection.appendChild(invitiTable);

  container.appendChild(invitiSection);
}

// Ottiene gli inviti ricevuti dall'utente
async function getInvitiRicevuti() {
  try {
    const response = await fetch(`${basePath}/read-inviti-ricevuti`, {
      method: "GET",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero degli inviti ricevuti:", error);
    return [];
  }
}

// Funzione per creare la tabella degli inviti ricevuti
function createInvitiTable(inviti) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Intestazioni tabella
  const headers = ["Campionato", "Ruolo", "Da Utente", "Azioni"];
  const headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Righe dei dati
  inviti.forEach((invito) => {
    const row = document.createElement("tr");

    // Dati dell'invito
    const campionato = invito.campionato;
    const cells = [
      campionato.nome,
      invito.ruoloInvito,
      invito.usernameUtenteCheHaInvitato,
    ];

    // Crea celle
    cells.forEach((cellText) => {
      const td = document.createElement("td");
      td.textContent = cellText;
      row.appendChild(td);
    });

    // Cella per le azioni (accetta/rifiuta)
    const actionsTd = document.createElement("td");

    // Bottone Accetta
    const acceptBtn = document.createElement("button");
    acceptBtn.className = "accept-btn";
    acceptBtn.textContent = "Accetta";
    acceptBtn.addEventListener("click", () => acceptInvito(invito.chiave));

    // Bottone Rifiuta (da implementare)
    const rejectBtn = document.createElement("button");
    rejectBtn.className = "reject-btn";
    rejectBtn.textContent = "Rifiuta";

    actionsTd.appendChild(acceptBtn);
    actionsTd.appendChild(rejectBtn);

    row.appendChild(actionsTd);

    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  return table;
}

// Funzione per accettare un invito
async function acceptInvito(chiaveInvito) {
  try {
    const response = await fetch(`${basePath}/accetta-invito/${chiaveInvito}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      // Aggiorna le liste
      await init();
    } else {
      console.error("Errore nell'accettazione dell'invito");
    }
  } catch (error) {
    console.error("Errore durante l'accettazione dell'invito:", error);
  }
}

async function logout() {
  localStorage.removeItem("user");
  const response = await fetch(basePath + "/logout", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  window.location.href = "../../index.html";
}

// Avvia l'inizializzazione
init();
