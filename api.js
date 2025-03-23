import * as apiCaller from "/service/api-caller.js";


const basePath =
  window.location.hostname === "" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080"
    : "https://customfantabe.onrender.com";

getUtenteLoggato();

export async function handleRegister(event) {
  event.preventDefault();

  const form = event.target;
  const username = form.username.value;
  const nome = form.nome.value;
  const email = form.email.value;
  const password = form.password.value;

  const esito = await apiCaller.creaUtente(username, nome, email, password);

  if ("OK" == esito) {
    window.location.href = "index.html";
  } else {
    alert(
      "Errore nella registrazione: " +
        (data.message || "Controlla i dati inseriti.")
    );
  }
}

export async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    try {
      const utente = await apiCaller.effettuaAccesso(username, password);

      if (utente) {
        localStorage.setItem("user", JSON.stringify(utente));

        window.location.href = "/pages/campionati/campionati.html";
      }
    } catch(error) {
    }
}

async function getUtenteLoggato() {
    try {
      const utenteLoggato = await apiCaller.recuperaUtenteLoggato();

      if(utenteLoggato) {
        localStorage.setItem("user", JSON.stringify(utenteLoggato));
        window.location.href = "/pages/campionati/campionati.html";
      }
    } catch(error) {
    }
}
