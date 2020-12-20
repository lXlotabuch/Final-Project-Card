const btnCreate = document.querySelector('.btn-create');
btnCreate.addEventListener('click', addVisitWindow);
const containerCards = document.querySelector('.cards');

document.addEventListener('DOMContentLoaded', async function () {
	if (localStorage.token) {
		const data = await getItemsFromSer();

		data.forEach((item) => {
			render(item);
		});
	}
});

async function getItemsFromSer() {
	const res = await fetch('https://ajax.test-danit.com/api/cards', {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.token}`,
		},
	});
	const data = await res.json();
	return data;
}

class Visit {
	constructor(parentEl) {
		this.parentEl = parentEl;

		this.wrapper = document.createElement('form');
		this.wrapper.classList.add('visit-form');

		this.cardInfo = document.createElement('div');
		this.cardInfo.classList.add('card-info');

		this.item = new Select('doctor', 'Doctor', [
			'Cardiolog',
			'Dantist',
			'Terapist',
		]);

		this.item.addEventListener('change', (e) => {
			e.preventDefault();

			if (e.target.value.toLowerCase() === 'dantist') {
				const visitToDantist = new VisitDantist();
			}

			if (e.target.value.toLowerCase() === 'terapist') {
				const visitToTerapist = new VisitTerapist();
			}

			if (e.target.value.toLowerCase() === 'cardiolog') {
				const visitToCardiolog = new VisitCardiolog();
			}
		});

		this.priority = new Select('priority', 'Priority', [
			'low',
			'middle',
			'high',
		]);

		this.targetOfVisit = new Input(
			'text',
			'targetOfVisit',
			'Why u come?',
			'The purpose of the visit'
		);

		this.descriptionOfVisit = new TextArea(
			'description',
			'Description',
			'20',
			'5'
		);

		this.patient = new Input('text', 'fullName', 'Full Name', 'Full name');

		this.age = new Input('number', 'age', 'Age', 'Age');

		this.submitBtn = document.createElement('button');
		this.submitBtn.type = 'submit';
		this.submitBtn.textContent = 'Create';

		this.closeBtn = document.createElement('button');
		this.closeBtn.classList.add('close-form');
		this.closeBtn.textContent = 'Close';
		this.closeBtn.addEventListener('click', (e) => {
			e.preventDefault();

			removeElToClass('modalDiv');
		});

		this.btnWrapper = document.createElement('div');
		this.btnWrapper.classList.add('btn-wrapper');
		this.btnWrapper.appendChild(this.submitBtn);
		this.btnWrapper.appendChild(this.closeBtn);

		this.wrapper.appendChild(this.item);
		this.wrapper.appendChild(this.cardInfo);
		this.wrapper.addEventListener('submit', (e) => {
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

		this.card = document.querySelector('.card-info');
		this.card.innerHTML = '';

		this.lastVisitDate = new Input('date', 'lastVisit', 'Your last Visit', '');

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

		this.card = document.querySelector('.card-info');
		this.card.innerHTML = '';

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

		this.card = document.querySelector('.card-info');
		this.card.innerHTML = '';

		this.normalPressure = new Input(
			'number',
			'pressure',
			'Pressure',
			'Pressure'
		);

		this.weight = new Input('number', 'weight', ' Weight', 'Weight');

		this.diseases = new Input('text', 'diseases', 'Diseases', 'Diseases');

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
		this.label = document.createElement('label');
		this.label.for = name;

		this.el = document.createElement('input');
		this.el.type = type;
		this.el.classList.add(name);
		this.el.name = name;
		this.el.setAttribute('placeholder', placeholder);

		this.label.textContent = labelName;
		this.label.appendChild(this.el);

		return this.label;
	}
}

class Select {
	constructor(name, def, options) {
		this.label = document.createElement('label');

		this.el = document.createElement('select');
		this.el.innerHTML = `
      <option selected value="null">${def}</option>
    `;
		this.el.name = name;
		options.forEach((option) => {
			const el = document.createElement('option');
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
		this.label = document.createElement('label');
		this.label.textContent = labelName;

		this.el = document.createElement('textarea');
		this.el.name = name;
		this.el.cols = cols;
		this.el.rows = rows;

		this.label.appendChild(this.el);

		return this.label;
	}
}

async function postCard(card) {
	const res = await fetch('https://ajax.test-danit.com/api/cards', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${localStorage.token}`,
		},
		body: JSON.stringify(card),
	});
	const data = await res.json();
	console.log(data);

	if (res.status === 200) {
		removeElToClass('modalDiv');
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
	const cardContainer = document.createElement('div');
	cardContainer.classList.add('card');
	cardContainer.insertAdjacentHTML(
		'beforeend',
		`	<p class="name">${name}</p>
				<p class="doctor">${doctor}</p>
				<button class="showMore">Показать больше</button>
				<div class="hiddenInfo" hidden>
					<p class="age">Возраст:${age}</p>
					<p class="pressure">Давление:${pressure}</p>
					<p class="weight">Вес:${weight}</p>
					<p class="targetVisit">Цель визита:${targetOfVisit}</p>
					<p class="diseases">Список⠀болезней:${diseases}</p>
					<p class="priority">Приоритетность:${priority}</p>
					<button class="closeInfo" >Свернуть</button>
				</div>`
	);
	containerCards.appendChild(cardContainer);

	showInformation();
}

function showInformation() {
	containerCards.addEventListener('click', function (e) {
		if (
			e.target.nodeName.toLowerCase() === 'button' &&
			e.target.className === 'showMore'
		) {
			e.target.setAttribute('hidden', false);
			const parentEl = e.target.closest('div');
			const toggleInfoDiv = parentEl.children[3];
			toggleInfoDiv.hidden = false;
		}

		if (
			e.target.nodeName.toLowerCase() === 'button' &&
			e.target.className === 'closeInfo'
		) {
			const parelBtn = e.target.closest('div');
			const btnShow = parelBtn.parentNode.children[2];
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

function CreateDataFromForm(form) {
	const data = {};

	for (let el of form) {
		if (
			el.tagName.toUpperCase() == 'SELECT' ||
			el.tagName.toUpperCase() == 'INPUT' ||
			el.tagName.toUpperCase() == 'TEXTAREA'
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
