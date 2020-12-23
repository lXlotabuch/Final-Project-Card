import { postCard } from "./requestServ.js";
import { removeEl } from "./servises.js";

const body = document.querySelector("body");

export class popUpModal {
  constructor(parentEl) {
    this.item = document.createElement("div");
    this.item.classList.add("modalDiv");
    this.item.classList.add("animatePopUp");
    parentEl.append(this.item);
  }

  get() {
    return this.item;
  }
}

export class Form {
  constructor(parentEl) {
    this.item = document.createElement("form");
    this.item.classList.add("form-E-P");
    this.item.insertAdjacentHTML(
      "beforeend",
      `<div class="wrapper-inputs">
            <label for="emailText">Email: </label>
            <input name="email" type="email" id="emailText" />
          </div>
          <div class="wrapper-inputs">
            <label for="passwordText">Password: </label>
            <input name="password" type="password" id="passwordText" />
          </div>
          <button type="submit" name="send" class="submit-form">Подтвердить</button>`,
    );
    parentEl.appendChild(this.item);
  }

  get() {
    return this.item;
  }
}

export class Visit {
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

      const delEl = document.querySelector(".modalDiv");
      removeEl(delEl);
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

export class VisitDantist extends Visit {
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

export class VisitTerapist extends Visit {
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

export class VisitCardiolog extends Visit {
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
export class Input {
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

export class Select {
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

export class TextArea {
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

function CreateDataFromForm(container) {
  const data = {};

  for (let el of container) {
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
