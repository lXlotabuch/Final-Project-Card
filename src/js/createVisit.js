const btnCreate = document.querySelector(".btn-create");

btnCreate.addEventListener("click", addVisitWindow);

class Visit {
  constructor(parentEl) {
    this.parentEl = parentEl;
    this.wrapper = document.createElement("form");
    this.wrapper.classList.add("visit-form");

    this.item = document.createElement("select");
    this.item.classList.add("doctor");
    this.item.innerHTML = `
            <option selected value="null"></option>
            <option value="cardiolog">Cardiolog</option>
            <option value="dantist">Dantist</option>
            <option value="terapist">Terapist</option>
        `;
    this.item.addEventListener("change", (e) => {
      e.preventDefault();

      if (e.target.value === "dantist") {
        const visitToDantist = new VisitDantist();
      }

      if (e.target.value === "terapist") {
        const visitToTerapist = new VisitTerapist();
      }

      if (e.target.value === "cardiolog") {
        const visitToCardiolog = new VisitCardiolog();
      }
    });

    this.priority = document.createElement("select");
    this.priority.classList.add("priority-visit");
    this.priority.innerHTML = `
        <option selected value="null"></option>
        <option value="low">low</option>
        <option value="middle">middle</option>
        <option value="high">high</option>    
    `;

    this.targetOfVisit = document.createElement("input");
    this.targetOfVisit.type = "text";
    this.targetOfVisit.placeholder = "The purpose of the visit";
    this.targetOfVisit.classList.add("target-visit");

    this.descriptionOfVisit = document.createElement("textarea");
    this.descriptionOfVisit.classList.add("description-visit");
    this.descriptionOfVisit.name = "description-visit";
    this.descriptionOfVisit.cols = "20";
    this.descriptionOfVisit.rows = "5";

    this.patient = document.createElement("input");
    this.patient.type = "text";
    this.patient.placeholder = "Full name";
    this.patient.classList.add("patient-visit");

    this.age = document.createElement("input");
    this.age.type = "number";
    this.age.classList.add("age");

    this.submitBtn = document.createElement("button");
    this.submitBtn.type = "submit";
    this.submitBtn.textContent = "Create";

    this.wrapper.appendChild(this.item);
  }

  show() {
    this.parentEl.appendChild(this.wrapper);
  }
}

class VisitDantist extends Visit {
  constructor() {
    super(body);

    this.wrapper = document.querySelector(".visit-form");
    this.wrapper.innerHTML = "";

    this.lastVisitDate = document.createElement("input");
    this.lastVisitDate.type = "date";
    this.lastVisitDate.classList.add("date-visit");

    this.wrapper.appendChild(this.item);
    this.wrapper.appendChild(this.patient);
    this.wrapper.appendChild(this.targetOfVisit);
    this.wrapper.appendChild(this.descriptionOfVisit);
    this.wrapper.appendChild(this.priority);
    this.wrapper.appendChild(this.lastVisitDate);
    this.wrapper.appendChild(this.submitBtn);
  }
}

class VisitTerapist extends Visit {
  constructor(body) {
    super(body);

    this.wrapper = document.querySelector(".visit-form");
    this.wrapper.innerHTML = "";

    this.wrapper.appendChild(this.item);
    this.wrapper.appendChild(this.patient);
    this.wrapper.appendChild(this.targetOfVisit);
    this.wrapper.appendChild(this.descriptionOfVisit);
    this.wrapper.appendChild(this.priority);
    this.wrapper.appendChild(this.age);
    this.wrapper.appendChild(this.submitBtn);
  }
}

class VisitCardiolog extends Visit {
  constructor(body) {
    super(body);

    this.wrapper = document.querySelector(".visit-form");
    this.wrapper.innerHTML = "";

    this.normalPressure = document.createElement("input");
    this.normalPressure.type = "number";
    this.normalPressure.classList.add("pressure");

    this.weight = document.createElement("input");
    this.weight.type = "number";
    this.weight.classList.add("weight");

    this.diseases = document.createElement("input");
    this.diseases.type = "text";
    this.diseases.classList.add("diseases");

    this.wrapper.appendChild(this.item);
    this.wrapper.appendChild(this.patient);
    this.wrapper.appendChild(this.targetOfVisit);
    this.wrapper.appendChild(this.descriptionOfVisit);
    this.wrapper.appendChild(this.priority);
    this.wrapper.appendChild(this.normalPressure);
    this.wrapper.appendChild(this.weight);
    this.wrapper.appendChild(this.diseases);
    this.wrapper.appendChild(this.age);
    this.wrapper.appendChild(this.submitBtn);
  }
}

function addVisitWindow(e) {
  e.preventDefault();

  const modal = new popUpModal(body);
  const visit = new Visit(modal.item);
  visit.show();
}
