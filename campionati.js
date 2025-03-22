const basePath = window.location.hostname === "" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http://localhost:8080" : "https://customfantabe.onrender.com";

// Recupera l'utente loggato
async function getLoggedUser() {
  try {
    const response = await fetch(`${basePath}/get-utente-loggato`);
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero dell'utente loggato:", error);
    return null;
  }
}

// Ottiene la lista dei campionati dell'utente
async function getCampionati() {
  try {
    const response = await fetch(`${basePath}/campionati-utente`);
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campionato)
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Errore nella creazione del campionato');
    }
  } catch (error) {
    console.error("Errore durante la creazione del campionato:", error);
    return null;
  }
}

// Funzione per creare la tabella dei campionati
function createTable(campionati) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Intestazioni tabella
  const headers = ['Nome', 'Descrizione', 'Owner', 'Ruolo'];
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Righe dei dati
  campionati.forEach(campionato => {
    const row = document.createElement('tr');
    const cells = [
      campionato.nomeCampionato,
      campionato.descrizioneCampionato,
      campionato.ownerCampionato,
      campionato.ruoloUtente
    ];
    cells.forEach(cellText => {
      const td = document.createElement('td');
      td.textContent = cellText;
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  return table;
}

// Funzione per creare il form di creazione
function createForm(username) {
  const form = document.createElement('form');
  form.className = 'create-form';

  // Input Nome
  const nomeLabel = document.createElement('label');
  nomeLabel.textContent = 'Nome:';
  const nomeInput = document.createElement('input');
  nomeInput.type = 'text';
  nomeInput.name = 'nome';
  nomeInput.required = true;
  nomeLabel.appendChild(nomeInput);

  // Input Descrizione
  const descrizioneLabel = document.createElement('label');
  descrizioneLabel.textContent = 'Descrizione:';
  const descrizioneInput = document.createElement('input');
  descrizioneInput.type = 'text';
  descrizioneInput.name = 'descrizione';
  descrizioneInput.required = true;
  descrizioneLabel.appendChild(descrizioneInput);

  // Bottone submit
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Crea Campionato';
  submitButton.type = 'submit';

  // Aggiungi elementi al form
  form.appendChild(nomeLabel);
  form.appendChild(descrizioneLabel);
  form.appendChild(submitButton);

  // Gestore per il submit del form
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = nomeInput.value;
    const descrizione = descrizioneInput.value;

    if (!nome || !descrizione) return;

    const nuovoCampionato = await createCampionato(nome, descrizione);

    if (nuovoCampionato) {
      // Aggiorna la tabella
      const campionati = await getCampionati();
      const table = createTable(campionati);
      document.getElementById('table-container').replaceChild(table, document.getElementById('table-container').firstChild);

      // Pulisci il form
      nomeInput.value = '';
      descrizioneInput.value = '';
    }
  });

  return form;
}

// Inizializzazione dell'interfaccia
// Inizializzazione dell'interfaccia
async function init() {
  const user = await getLoggedUser();
  if (!user) {
    console.error("Utente non trovato");
    return;
  }

  const campionati = await getCampionati();
  const inviti = await getInvitiRicevuti();

  // Crea contenitore principale
  const container = document.createElement('div');
  container.id = 'main-container';

  // Crea form
  const form = createForm(user.username);
  container.appendChild(form);

  // Crea tabella campionati
  const tableContainer = document.createElement('div');
  tableContainer.id = 'table-container';
  const campionatiTable = createTable(campionati);
  tableContainer.appendChild(campionatiTable);
  container.appendChild(tableContainer);

  // Crea sezione per gli inviti
  const invitiSection = document.createElement('div');
  invitiSection.className = 'inviti-section';

  const invitiHeader = document.createElement('h2');
  invitiHeader.textContent = 'Inviti ricevuti';
  invitiSection.appendChild(invitiHeader);

  const invitiTable = createInvitiTable(inviti);
  invitiSection.appendChild(invitiTable);

  container.appendChild(invitiSection);

  // Aggiungi contenitore al body
  document.body.appendChild(container);
}


// Ottiene gli inviti ricevuti dall'utente
async function getInvitiRicevuti() {
  try {
    const response = await fetch(`${basePath}/read-inviti-ricevuti`);
    return await response.json();
  } catch (error) {
    console.error("Errore nel recupero degli inviti ricevuti:", error);
    return [];
  }
}


// Funzione per creare la tabella degli inviti ricevuti
function createInvitiTable(inviti) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Intestazioni tabella
  const headers = ['Campionato', 'Ruolo', 'Da Utente', 'Azioni'];
  const headerRow = document.createElement('tr');
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Righe dei dati
  inviti.forEach(invito => {
    const row = document.createElement('tr');

    // Dati dell'invito
    const campionato = invito.campionato;
    const cells = [
      campionato.nome,
      invito.ruoloInvito,
      invito.usernameUtenteCheHaInvitato
    ];

    // Crea celle
    cells.forEach(cellText => {
      const td = document.createElement('td');
      td.textContent = cellText;
      row.appendChild(td);
    });

    // Cella per le azioni (accetta/rifiuta)
    const actionsTd = document.createElement('td');

    // Bottone Accetta
    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'accept-btn';
    acceptBtn.textContent = 'Accetta';
    acceptBtn.addEventListener('click', () => acceptInvito(invito.chiave));

    // Bottone Rifiuta (da implementare)
    const rejectBtn = document.createElement('button');
    rejectBtn.className = 'reject-btn';
    rejectBtn.textContent = 'Rifiuta';

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
      method: 'GET'
    });

    if (response.ok) {
      // Aggiorna le liste
      await init(); // Ricarica tutto per semplicità
    } else {
      console.error("Errore nell'accettazione dell'invito");
    }
  } catch (error) {
    console.error("Errore durante l'accettazione dell'invito:", error);
  }
}

// Avvia l'inizializzazione
init();