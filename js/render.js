import { deleteCard } from "./requestServ.js";
import { changeCard } from "./changeCard.js";

const containerCards = document.querySelector(".cards");

export function render(item) {
  let name = item.content.fullName;
  let doctor = item.content.doctor;
  let age = item.content.age;
  let pressure = item.content.pressure;
  let weight = item.content.weight;
  let diseases = item.content.diseases;
  let targetOfVisit = item.content.targetOfVisit;
  let priority = item.content.priority;

  if (name === undefined || name === "") {
    name = "Информация не указана";
  }
  if (doctor === undefined || doctor === "") {
    doctor = "Информация не указана";
  }
  if (age === undefined || age === "") {
    age = "Информация не указана";
  }
  if (pressure === undefined || pressure === "") {
    pressure = "Информация не указана";
  }
  if (weight === undefined || weight === "") {
    weight = "Информация не указана";
  }
  if (diseases === undefined || diseases === "") {
    diseases = "Информация не указана";
  }
  if (targetOfVisit === undefined || targetOfVisit === "") {
    targetOfVisit = "Информация не указана";
  }
  if (priority === undefined || priority === "" || priority === "null") {
    priority = "Информация не указана";
  }

  const cardContainer = document.createElement("div");
  cardContainer.classList.add("card");
  cardContainer.dataset.id = item.id;
  // edit info
  const editInfoContainer = document.createElement("div");
  editInfoContainer.classList.add("editInfoContainer");

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("edit");
  btnEdit.textContent = "Редактировать";
  btnEdit.classList.add("edit");
  btnEdit.addEventListener("click", function (e) {
    let currentBtn = e.target;
    currentBtn.hidden = true;
    const popUpOptions = currentBtn.nextElementSibling;
    popUpOptions.hidden = false;
  });

  editInfoContainer.appendChild(btnEdit);

  const popUpchose = document.createElement("div");
  popUpchose.classList.add("popUpchose");
  popUpchose.setAttribute("hidden", true);

  const deleteCard = document.createElement("button");
  deleteCard.classList.add("deleteCard");
  deleteCard.textContent = "Удалить карточку";
  deleteCard.addEventListener("click", removeCard);

  const editCard = document.createElement("button");
  editCard.classList.add("editCard");
  editCard.textContent = "Редактировать карточку";
  popUpchose.appendChild(editCard);
  popUpchose.appendChild(deleteCard);
  editCard.addEventListener("click", changeCard);

  editInfoContainer.appendChild(popUpchose);
  cardContainer.appendChild(editInfoContainer);

  // --------------

  cardContainer.insertAdjacentHTML(
    "beforeend",
    `		
        <p class="name">${name}</p>
        <p class="doctor">${doctor}</p>
        <button class="showMore">Показать больше</button>
        <div class="hiddenInfo" hidden>
          <p class="age">Возраст:${age}</p>
          <p class="pressure">Давление:${pressure}</p>
          <p class="weight">Вес:${weight}</p>
          <p class="targetVisit">Цель визита:${targetOfVisit}</p>
          <p class="diseases">Список⠀болезней:${diseases}</p>
          <p class="priority">Приоритетность:${priority}</p>
          <button class="closeInfo">Свернуть</button>
        </div>
        `,
  );

  containerCards.addEventListener("click", showInformation);
  containerCards.appendChild(cardContainer);
}

async function removeCard(e) {
  const card = e.target.parentNode.parentNode.parentNode;
  const res = await deleteCard(card.dataset.id);
  if (res.status === 200) {
    card.remove();
  }
}

function showInformation(e) {
  if (
    e.target.nodeName.toLowerCase() === "button" &&
    e.target.className === "showMore"
  ) {
    const card = e.target.parentNode;
    e.target.setAttribute("hidden", false);
    const parentEl = e.target.closest("div");
    const toggleInfoDiv = parentEl.children[4];
    toggleInfoDiv.hidden = false;
    card.classList.toggle("card-big");
  }

  if (
    e.target.nodeName.toLowerCase() === "button" &&
    e.target.className === "closeInfo"
  ) {
    const card = e.target.parentNode.parentNode;
    const parelBtn = e.target.closest("div");
    const btnShow = parelBtn.parentNode.children[3];
    btnShow.hidden = false;
    const hideInfo = e.target.parentNode;
    hideInfo.hidden = true;
    card.classList.toggle("card-big");
  }
}
