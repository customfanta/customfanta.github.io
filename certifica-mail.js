import * as apiCaller from "./service/api-caller.js";

logout();

window.logout = logout;
export async function logout() {
  localStorage.removeItem("user");
  await apiCaller.logOut();
  window.location.href = "index.html";
}