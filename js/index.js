import {
  getItemsFromSer,
  postCard,
  getOneCard,
  putCard,
  Authorization,
  deleteCard,
} from "./requestServ.js";
import {
  popUpModal,
  Form,
  Visit,
  VisitDantist,
  VisitTerapist,
  VisitCardiolog,
} from "./classes.js";
import { render } from "./render.js";
import { removeEl } from "./servises.js";

const body = document.querySelector("body");
const btnCreate = document.querySelector(".btn-create");
const btnLogin = document.querySelector(".btn-login");
const containerCards = document.querySelector(".cards");
const textNoItem = document.querySelector(".no-item");
const filter = document.querySelector(".filter");

// CHECK TOKEN AND ADDD CARDS
document.addEventListener("DOMContentLoaded", checkToken);

btnCreate.addEventListener("click", addVisitWindow);

filter.addEventListener("submit", filtered);

btnLogin.addEventListener("click", runWindow);

// CREATE MODAL
function runWindow() {
  const popUp = new popUpModal(body);
  const PopUpWindow = popUp.get();
  const form = new Form(PopUpWindow);
  const formConfrimCheck = form.get();

  AuthorizationCall(formConfrimCheck, PopUpWindow);
}

// CREATE VISIT
function addVisitWindow(e) {
  e.preventDefault();

  const modal = new popUpModal(body);
  const visit = new Visit(modal.item);
  visit.show();
}

// AUTHORIZATION
function AuthorizationCall(formConfrimCheck, PopUpWindow) {
  formConfrimCheck.addEventListener("submit", async function (e) {
    e.preventDefault();
    let inputEmailValue = formConfrimCheck.children[0].children[1];
    let passwordInput = formConfrimCheck.children[1].children[1];
    let emailValue = inputEmailValue.value;
    let passwordValue = passwordInput.value;

    const authObj = {
      email: emailValue,
      password: passwordValue,
    };

    if (inputEmailValue.value.trim() === "") {
      inputEmailValue.value = "";
      return;
    }

    const [response, data] = await Authorization(authObj);

    if (response.status === 200) {
      localStorage.setItem("token", data);
      checkToken();
      removeEl(PopUpWindow);
    }
  });
}

// FILTER
async function filtered(e) {
  e.preventDefault();

  const data = await getItemsFromSer();
  const searchInput = document.querySelector(".search-input");
  const selectPriority = document.querySelector(".priority");

  containerCards.innerHTML = "";
  const dataNew = data.filter((item) => {
    if (
      searchInput.value.length > 2 &&
      !item.content.doctor.toLowerCase().includes(searchInput.value.toLowerCase())
    ) {
      return false;
    }
    if (selectPriority.value != "null") {
      if (!item.content.priority.toLowerCase().includes(selectPriority.value.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  dataNew.forEach((item) => {
    render(item);
  });
}

// CHECK TOKEN
async function checkToken() {
  if (localStorage.token) {
    const data = await getItemsFromSer();
    btnCreate.style.display = "block";
    btnLogin.style.display = "none";
    textNoItem.remove();
    filter.style.display = "flex";
    data.forEach((item) => {
      render(item);
    });
  }
}
