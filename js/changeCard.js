import { popUpModal, VisitCardiolog } from "./classes.js";
import { getItemsFromSer, getOneCard, putCard } from "./requestServ.js";
import { removeEl } from "./servises.js";
import { render } from "./render.js";

const body = document.querySelector("body");
const containerCards = document.querySelector(".cards");

export async function changeCard(e) {
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
    newCardPut(changeForm.card, card, cardInfo);
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

async function newCardPut(form, card, cardInfo) {
  const data = {...cardInfo.content};
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

  const res = await putCard(card, data);

  if (res.status == 200) {
    const delEl = document.querySelector(".modalDiv");
    removeEl(delEl);
    const newData = await getItemsFromSer();
    containerCards.innerHTML = "";
    newData.forEach((el) => {
      render(el);
    });
  }
}
