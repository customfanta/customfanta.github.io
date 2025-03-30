import * as apiCaller from "/service/api-caller.js";

getUtenteLoggato();

window.handleRegister = handleRegister;
export async function handleRegister(event) {
  event.preventDefault();

  const form = event.target;
  const username = form.username.value;
  const nome = form.nome.value;
  const email = form.email.value;
  const password = form.password.value;

  const esito = await apiCaller.creaUtente(username, nome, email, password);

  if (esito && "OK" == esito.esito) {
    window.location.href = "index.html";
  } else {
    alert(
      "Errore nella registrazione: " +
        (data.message || "Controlla i dati inseriti.")
    );
  }
}

window.handleLogin = handleLogin;
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
  } catch (error) {}
}

window.getUtenteLoggato = getUtenteLoggato;
export async function getUtenteLoggato() {
  try {
    const utenteLoggato = await apiCaller.recuperaUtenteLoggato();

    if (utenteLoggato) {
      localStorage.setItem("user", JSON.stringify(utenteLoggato));
      window.location.href = "/pages/campionati/campionati.html";
    }
  } catch (error) {}
}
