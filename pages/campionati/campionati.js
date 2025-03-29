import * as apiCaller from "/service/api-caller.js";

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "../../index.html";
}

if(!apiCaller.isLocalValue) {
  const socket = new SockJS(apiCaller.serverHost + "/ws-endpoint");
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
}

document.getElementById("logout-button").addEventListener("click", logout);
document.getElementById("crea-campionato-button").addEventListener("click", showModelCreaCampionato);


init();

window.createTable = createTable;
export function createTable(campionati, mailCertificata) {
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

window.creaCampionato = creaCampionato;
export async function creaCampionato() {
  let nome = document.getElementById("nome-campionato-input").value;
  let descrizione = document.getElementById("descrizione-campionato-input").value;
  const nuovoCampionato = await apiCaller.creaCampionato(nome, descrizione);

  if (nuovoCampionato) {
    const campionati = await apiCaller.recuperaCampionati();
    const table = createTable(campionati, true);
    document
      .getElementById("table-container")
      .replaceChild(
        table,
        document.getElementById("table-container").firstChild
      );

    nomeInput.value = "";
    descrizioneInput.value = "";
  }
  closeModaleCreaCampionato();
}

window.init = init;
export async function init() {

  const campionati = await apiCaller.recuperaCampionati();
  const inviti = await apiCaller.recuperaInvitiRicevuti();

  let container = document.getElementById("content-page");

  if (user.mailCertificata) {
    document.getElementById('warning-box-mail-non-certificata').style.display = 'none';
    document.getElementById("crea-campionato-button").style.display = "block";
  } else {
      document.getElementById('warning-box-mail-non-certificata').style.display = 'block';
      document.getElementById("crea-campionato-button").style.display = "none";
  }

  // Crea tabella campionati
  let tableContainer = document.getElementById("table-container");
  if(tableContainer) {
    tableContainer.innerHTML = "";
  } else {
    tableContainer = document.createElement("div");
    tableContainer.id = "table-container";
  }
  const campionatiTable = createTable(campionati, user.mailCertificata);
  tableContainer.appendChild(campionatiTable);
  container.appendChild(tableContainer);

  // Crea sezione per gli inviti
  const invitiSection = document.createElement("div");
  invitiSection.className = "inviti-section";

  const invitiHeader = document.createElement("h2");
  invitiHeader.textContent = "Inviti ricevuti";
  invitiHeader.setAttribute("class", "title-table");
  invitiSection.appendChild(invitiHeader);

  const invitiTable = createInvitiTable(inviti);
  invitiSection.appendChild(invitiTable);

  container.appendChild(invitiSection);
}

window.createInvitiTable = createInvitiTable;
export function createInvitiTable(inviti) {
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

window.acceptInvito = acceptInvito;
export async function acceptInvito(chiaveInvito) {
  try {
    const esito = await apiCaller.accettaInvito(chiaveInvito);

    if (esito && "OK" == esito.esito) {
      await init();
    } else {
      console.error("Errore nell'accettazione dell'invito");
    }
  } catch (error) {
    console.error("Errore durante l'accettazione dell'invito:", error);
  }
}

window.logout = logout;
export async function logout() {
  localStorage.removeItem("user");
  await apiCaller.logOut();
  window.location.href = "../../index.html";
}


window.showModelCreaCampionato = showModelCreaCampionato;
export async function showModelCreaCampionato() {

  document.getElementById('crea-campionato-modale').style.display = 'block';


  // localStorage.removeItem("user");
  // await apiCaller.logOut();
  // window.location.href = "../../index.html";
}




window.openModal = openModal;
export function openModal(charName, chiavePersonaggio) {
    selectedCharacter = chiavePersonaggio;
    const modalTitle = document.querySelector('#assignModal h3');
    modalTitle.textContent = `Assegna Azione a ${charName}`;
    document.getElementById('assignModal').style.display = 'block';
    populateActionSelect();
}

window.closeModaleCreaCampionato = closeModaleCreaCampionato;
export function closeModaleCreaCampionato() {
    document.getElementById('crea-campionato-modale').style.display = 'none';
}