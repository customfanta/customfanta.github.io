const basePath = "https://customfantabe.onrender.com";
//const basePath = "http://localhost:8080";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";


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
async function init() {
  const user = await getLoggedUser();
  if (!user) {
    console.error("Utente non trovato");
    return;
  }

  const campionati = await getCampionati();

  // Crea contenitore principale
  const container = document.createElement('div');
  container.id = 'main-container';

  // Crea form
  const form = createForm(user.username);
  container.appendChild(form);

  // Crea tabella
  const table = createTable(campionati);
  container.appendChild(table);

  // Aggiungi contenitore al body
  document.body.appendChild(container);
}

// Avvia l'inizializzazione
init();