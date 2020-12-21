const body = document.querySelector("body");
const btnCreate = document.querySelector(".btn-create");
btnCreate.addEventListener("click", addVisitWindow);
const containerCards = document.querySelector(".cards");
// filter card
const searchInput = document.querySelector(".search-input");
const submitSearch = document.querySelector(".submit");
const selectPriority = document.querySelector(".priority");

document.addEventListener("DOMContentLoaded", async function () {
  if (localStorage.token) {
    const data = await getItemsFromSer();

    data.forEach((item) => {
      render(item);
    });
  }
});

async function getItemsFromSer() {
  const res = await fetch("https://ajax.test-danit.com/api/cards", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  const data = await res.json();
  return data;
}

class Visit {
  constructor(parentEl) {
    this.parentEl = parentEl;

    this.wrapper = document.createElement("form");
    this.wrapper.classList.add("visit-form");

    this.cardInfo = document.createElement("div");
    this.cardInfo.classList.add("card-info");

    this.item = new Select("doctor", "Doctor", [
      "Cardiolog",
      "Dantist",
      "Terapist",
    ]);

    this.item.addEventListener("change", (e) => {
      e.preventDefault();

      if (e.target.value.toLowerCase() === "dantist") {
        const visitToDantist = new VisitDantist();
      }

      if (e.target.value.toLowerCase() === "terapist") {
        const visitToTerapist = new VisitTerapist();
      }

      if (e.target.value.toLowerCase() === "cardiolog") {
        const visitToCardiolog = new VisitCardiolog();
      }
    });

    this.priority = new Select("priority", "Priority", [
      "low",
      "middle",
      "high",
    ]);

    this.targetOfVisit = new Input(
      "text",
      "targetOfVisit",
      "Why u come?",
      "The purpose of the visit",
    );

    this.descriptionOfVisit = new TextArea(
      "description",
      "Description",
      "20",
      "5",
    );

    this.patient = new Input("text", "fullName", "Full Name", "Full name");

    this.age = new Input("number", "age", "Age", "Age");

    this.submitBtn = document.createElement("button");
    this.submitBtn.type = "submit";
    this.submitBtn.textContent = "Create";

    this.closeBtn = document.createElement("button");
    this.closeBtn.classList.add("close-form");
    this.closeBtn.textContent = "Close";
    this.closeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      removeElToClass("modalDiv");
    });

    this.btnWrapper = document.createElement("div");
    this.btnWrapper.classList.add("btn-wrapper");
    this.btnWrapper.appendChild(this.submitBtn);
    this.btnWrapper.appendChild(this.closeBtn);

    this.wrapper.appendChild(this.item);
    this.wrapper.appendChild(this.cardInfo);
    this.wrapper.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = CreateDataFromForm(this.wrapper);

      postCard(data);
    });
  }

  show() {
    this.parentEl.appendChild(this.wrapper);
  }
}

class VisitDantist extends Visit {
  constructor() {
    super(body);

    this.card = document.querySelector(".card-info");
    this.card.innerHTML = "";

    this.lastVisitDate = new Input("date", "lastVisit", "Your last Visit", "");

    this.card.appendChild(this.patient);
    this.card.appendChild(this.targetOfVisit);
    this.card.appendChild(this.descriptionOfVisit);
    this.card.appendChild(this.priority);
    this.card.appendChild(this.lastVisitDate);
    this.card.appendChild(this.btnWrapper);
  }
}

class VisitTerapist extends Visit {
  constructor(body) {
    super(body);

    this.card = document.querySelector(".card-info");
    this.card.innerHTML = "";

    this.card.appendChild(this.patient);
    this.card.appendChild(this.targetOfVisit);
    this.card.appendChild(this.descriptionOfVisit);
    this.card.appendChild(this.priority);
    this.card.appendChild(this.age);
    this.card.appendChild(this.btnWrapper);
  }
}

class VisitCardiolog extends Visit {
  constructor(body) {
    super(body);

    this.card = document.querySelector(".card-info");
    this.card.innerHTML = "";

    this.normalPressure = new Input(
      "number",
      "pressure",
      "Pressure",
      "Pressure",
    );

    this.weight = new Input("number", "weight", " Weight", "Weight");

    this.diseases = new Input("text", "diseases", "Diseases", "Diseases");

    this.card.appendChild(this.patient);
    this.card.appendChild(this.targetOfVisit);
    this.card.appendChild(this.descriptionOfVisit);
    this.card.appendChild(this.priority);
    this.card.appendChild(this.normalPressure);
    this.card.appendChild(this.weight);
    this.card.appendChild(this.diseases);
    this.card.appendChild(this.age);
    this.card.appendChild(this.btnWrapper);
  }
}
class Input {
  constructor(type, name, labelName, placeholder) {
    this.label = document.createElement("label");
    this.label.for = name;

    this.el = document.createElement("input");
    this.el.type = type;
    this.el.classList.add(name);
    this.el.name = name;
    this.el.setAttribute("placeholder", placeholder);

    this.label.textContent = labelName;
    this.label.appendChild(this.el);

    return this.label;
  }
}

class Select {
  constructor(name, def, options) {
    this.label = document.createElement("label");

    this.el = document.createElement("select");
    this.el.innerHTML = `
      <option selected value="null">${def}</option>
    `;
    this.el.name = name;
    options.forEach((option) => {
      const el = document.createElement("option");
      el.textContent = option;
      el.value = option;
      this.el.appendChild(el);
    });

    this.label.appendChild(this.el);

    return this.label;
  }
}

class TextArea {
  constructor(name, labelName, cols, rows) {
    this.label = document.createElement("label");
    this.label.textContent = labelName;

    this.el = document.createElement("textarea");
    this.el.name = name;
    this.el.cols = cols;
    this.el.rows = rows;

    this.label.appendChild(this.el);

    return this.label;
  }
}

// filtered by search input

// ------------------------------------------------------------------------------------
(async () => {
  const res = await fetch("https://ajax.test-danit.com/api/cards", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  const data = await res.json();
  console.log(data);

  let searchInputValue = "";
  let selectPriorityValue = "";

  searchInput.addEventListener("keyup", updateSearchInput);

  selectPriority.addEventListener("change", function (e) {
    selectPriorityValue = e.target.value.toLowerCase();
    filter(data);
  });

  function updateSearchInput(e) {
    searchInputValue = e.target.value.toLowerCase();
    filter(data);
  }
  function filter(data) {
    if (searchInputValue.length < 2) {
      containerCards.innerHTML = "";

      data.forEach((item) => {
        render(item);
      });
    }
    const filtered = data.filter((item) => {
      if (
        searchInputValue.length > 2 &&
        !item.content.doctor.toLowerCase().includes(searchInputValue)
      ) {
        return false;
      }
      if (!item.content.priority.toLowerCase().includes(selectPriorityValue)) {
        return false;
      }
      return true;
    });

    submitSearch.addEventListener("click", function (e) {
      e.preventDefault();

      containerCards.innerHTML = "";
      filtered.forEach((item) => {
        render(item);
      });
    });
  }
})();

// ------------------------------------------------------------------------------------

async function postCard(card) {
  const res = await fetch("https://ajax.test-danit.com/api/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: JSON.stringify(card),
  });
  const data = await res.json();

  if (res.status === 200) {
    removeElToClass("modalDiv");
    render(data);
  }
}

function render(item) {
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
  editInfoContainer.appendChild(btnEdit);

  const popUpchose = document.createElement("div");
  popUpchose.classList.add("popUpchose");
  popUpchose.setAttribute("hidden", true);

  const deleteCard = document.createElement("button");
  deleteCard.classList.add("deleteCard");
  deleteCard.textContent = "Удалить карточку";

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
  containerCards.appendChild(cardContainer);

  showInformation();
  // Edit information
  editInfo(btnEdit, deleteCard, cardContainer);
}
function editInfo(btnEdit, deleteCard, cardContainer) {
  btnEdit.addEventListener("click", function (e) {
    let currentBtn = e.target;
    currentBtn.hidden = true;
    const popUpOptions = currentBtn.nextElementSibling;
    popUpOptions.hidden = false;
  });

  deleteCard.addEventListener("click", function () {
    let id = cardContainer.getAttribute("data-id");
    let url = "https://ajax.test-danit.com/api/v2/cards/";
    deleteItem(url, id, cardContainer);
  });
}
async function deleteItem(url, id, cardContainer) {
  const res = await fetch(`${url}${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (res.status === 200) {
    cardContainer.remove();
  }
}

function showInformation() {
  containerCards.addEventListener("click", function (e) {
    if (
      e.target.nodeName.toLowerCase() === "button" &&
      e.target.className === "showMore"
    ) {
      e.target.setAttribute("hidden", false);
      const parentEl = e.target.closest("div");
      const toggleInfoDiv = parentEl.children[4];
      toggleInfoDiv.hidden = false;
    }

    if (
      e.target.nodeName.toLowerCase() === "button" &&
      e.target.className === "closeInfo"
    ) {
      const parelBtn = e.target.closest("div");
      const btnShow = parelBtn.parentNode.children[3];
      btnShow.hidden = false;
      const hideInfo = e.target.parentNode;
      hideInfo.hidden = true;
    }
  });
}

function addVisitWindow(e) {
  e.preventDefault();

  const modal = new popUpModal(body);
  const visit = new Visit(modal.item);
  visit.show();
}

function CreateDataFromForm(container) {
  const data = {};

  for (let el of container) {
    console.log(el);
    if (
      el.tagName.toUpperCase() == "SELECT" ||
      el.tagName.toUpperCase() == "INPUT" ||
      el.tagName.toUpperCase() == "TEXTAREA"
    ) {
      data[el.name] = el.value;
    }
  }
  return data;
}

function removeElToClass(elClass) {
  const el = document.querySelector(`.${elClass}`);

  el.remove();
}

// Change Card

async function changeCard(e) {
  e.preventDefault();

  const card = e.target.parentNode.parentNode.parentNode;
  const modal = new popUpModal(body);
  modal.item.innerHTML = `<div class="card-info"></div>`;
  const changeForm = new VisitCardiolog();
  const cardInfo = await getOneCard(card);
  const {
    fullName = null,
    age = null,
    description = null,
    diseases = null,
    pressure = null,
    priority = null,
    weight = null,
    targetOfVisit = null,
  } = cardInfo.content;

  changeForm.submitBtn.addEventListener("click", (e) => {
    newCardPut(changeForm.card, card);
  });

  changeForm.patient.lastChild.value = fullName;
  changeForm.age.lastChild.value = age;
  changeForm.descriptionOfVisit.lastChild.value = description;
  changeForm.diseases.lastChild.value = diseases;
  changeForm.normalPressure.lastChild.value = pressure;
  changeForm.priority.lastChild.value = priority;
  changeForm.weight.lastChild.value = weight;
  changeForm.targetOfVisit.lastChild.value = targetOfVisit;
}

async function getOneCard(card) {
  const url = "https://ajax.test-danit.com/api/cards/";
  const res = await fetch(url + card.dataset.id, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
  });

  const data = await res.json();

  return data;
}

async function newCardPut(form, card) {
  const url = "https://ajax.test-danit.com/api/cards/";
  const data = {};
  for (let el of form.children) {
    el = el.lastChild;
    if (
      el.tagName.toUpperCase() == "SELECT" ||
      el.tagName.toUpperCase() == "INPUT" ||
      el.tagName.toUpperCase() == "TEXTAREA"
    ) {
      if (el.value.trim() == "") {
        continue;
      }
      data[el.name] = el.value;
    }
  }

  const res = await fetch(url + card.dataset.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status == 200) {
    removeElToClass("modalDiv");
    const newData = await getItemsFromSer();
    containerCards.innerHTML = "";
    newData.forEach((el) => {
      render(el);
    });
  }
}
