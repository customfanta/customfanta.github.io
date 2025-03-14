const basePath = "https://customfantabe.onrender.com";
//const basePath = "http://localhost:8080";

const fetchSquadra = async (username) =>
    fetch(`${basePath}/read-squadra/${username}`, { method: 'GET', credentials: "include" })
        .then(response => (response.ok ? response.json() : null))


const socket = new SockJS(basePath + "/ws-endpoint");
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
     console.log("Connesso a STOMP");
     stompClient.subscribe("/topic/test-ws", (message) => {
            console.log("Messaggio dal server:", message.body);

            const user = JSON.parse(localStorage.getItem("user"));
            const squadraData = await fetchSquadra(user.username);
            if (squadraData) {
                displaySquadra(squadraData);
            }
     });
});

document.addEventListener("DOMContentLoaded", async function () {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Accesso non autorizzato. Effettua il login.");
        window.location.href = "index.html";
        return;
    }

    const username = user.username;

    document.getElementById("user-info").textContent = `Ciao ${username}`;

    if (user.profile === "ADMIN") {
        document.getElementById("admin-btn").style.display = "block";
    }

    fetchSquadra(username)
        .then(squadraData => {
            if (squadraData && squadraData.personaggi.length > 0) {
                displaySquadra(squadraData);
            } else {
                displayCreateForm(username);
            }
        })
        .catch(error => console.error('Errore:', error));
});

function displaySquadra(data) {
    const container = document.getElementById('content');
    container.innerHTML = `
        <div id="squadra-view">
            <h2>${data.squadra.nome}</h2>
            <p>${data.squadra.descrizione}</p>
            <h3>Personaggi:</h3>
            <ul id="personaggi-list"></ul>
            <p>Punteggio Totale: ${data.punteggioSquadra}</p>
        </div>
    `;

    const personaggiList = document.getElementById('personaggi-list');
    data.personaggi.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.nomePersonaggio} - ${p.punteggioAttuale}`;
        personaggiList.appendChild(li);
    });
}

function displayCreateForm(username) {
    const container = document.getElementById('content');
    container.innerHTML = `
        <div class="create-form">
            <input type="text" id="squadra-name" placeholder="Nome Squadra" required>
            <textarea id="squadra-desc" placeholder="Descrizione" required></textarea>
            <div id="personaggi-list"></div>
            <div id="remaining-credits">Crediti rimanenti: 160</div>
            <div id="selected-count">Selezionati: 0/5</div>
            <button id="create-btn" disabled>Creare Squadra</button>
        </div>
    `;

    // Utilizzo di basePath per le chiamate
    fetch(`${basePath}/read-personaggi`, { method: 'GET', credentials: "include" })
        .then(response => response.json())
        .then(personaggi => {
            if (personaggi.length === 0) {
                container.innerHTML = "Nessun personaggio disponibile";
                return;
            }

            const checkboxes = [];
            const list = document.getElementById('personaggi-list');

            personaggi.forEach(p => {
                const div = document.createElement('div');
                div.className = 'personaggio';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.cost = p.costo;
                checkbox.dataset.nominativo = p.nominativo;

                const label = document.createElement('label');
                label.textContent = `${p.nominativo} (Costo: ${p.costo})`;

                div.appendChild(checkbox);
                div.appendChild(label);
                list.appendChild(div);

                checkboxes.push(checkbox);
            });

            let selected = [];
            let credits = 160;
            let count = 0;

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const target = e.target;
                    const cost = parseInt(target.dataset.cost);
                    const name = target.dataset.nominativo;

                    if (target.checked) {
                        if (count < 5 && credits >= cost) {
                            selected.push({ name, cost });
                            credits -= cost;
                            count++;
                        } else {
                            target.checked = false;
                            alert('Crediti insufficienti o limite raggiunto');
                        }
                    } else {
                        const index = selected.findIndex(p => p.name === name);
                        if (index !== -1) {
                            selected.splice(index, 1);
                            credits += cost;
                            count--;
                        }
                    }

                    document.getElementById('remaining-credits').textContent = `Crediti rimanenti: ${credits}`;
                    document.getElementById('selected-count').textContent = `Selezionati: ${count}/5`;

                    document.getElementById('create-btn').disabled = !(count === 5 && credits >= 0);
                });
            });

            document.getElementById('create-btn').addEventListener('click', () => {
                const squadraName = document.getElementById('squadra-name').value;
                const squadraDesc = document.getElementById('squadra-desc').value;
                const nominativi = selected.map(p => p.name);

                const body = {
                    squadra: {
                        nome: squadraName,
                        descrizione: squadraDesc,
                        usernameUser: username
                    },
                    nomiPersonaggi: nominativi
                };

                // Utilizzo di basePath per la creazione
                fetch(`${basePath}/create-squadra/${username}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                    credentials: "include"
                })
                .then(() => fetchSquadra(username))
                .then(data => data ? displaySquadra(data) : alert('Errore creazione'))
                .catch(error => console.error('Errore:', error));
            });
        });
}

// Funzioni già presenti nel tuo codice
async function logout() {
    localStorage.removeItem("user");
    const response = await fetch(basePath + '/logout', { method: 'GET', credentials: "include" });
    const data = await response.json();
    window.location.href = "index.html";
}

function goToAdminPanel() {
    window.location.href = "pannello-admin.html";
}