const body = document.querySelector('body');
const BtnLogin = document.querySelector('.btn-login');
const BtnCreate = document.querySelector('.btn-create');
const textNoItem = document.querySelector('.no-item');
const filter = document.querySelector('.filter');
const containerCards = document.querySelector('.cards');

checkToken();

// ----------------------------------------------------------------------------------
// Test POST example

// async function testPOST(tok) {
// 	let obj = {
// 		name: 'John Dye',
// 		doctor: 'Pediatr',
// 	};
// 	const response = await fetch('https://ajax.test-danit.com/api/v2/cards', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${tok}`,
// 		},
// 		body: JSON.stringify(obj),
// 	});

// 	if (response.status === 200) {
// 		console.log('POST the data to server');
// 	}
// }

// testPOST(tok);
// problem создаетсья два массива {[name: "John Dye"m doctor: "Pediatr"], [name: "John Dye"m doctor: "Pediatr"]}

// ------------------------------------------------------------------------------------

class popUpModal {
	constructor(parentEl) {
		this.item = document.createElement('div');
		this.item.classList.add('modalDiv');
		this.item.classList.add('animatePopUp');
		parentEl.append(this.item);
	}

	get() {
		return this.item;
	}
}

class Form {
	constructor(parentEl) {
		this.item = document.createElement('form');
		this.item.classList.add('form-E-P');
		this.item.insertAdjacentHTML(
			'beforeend',
			`<div class="wrapper-inputs">
                        <label for="emailText">Email: </label>
					    <input name="email" type="email" id="emailText" />
                    </div>
                    <div class="wrapper-inputs">
                        <label for="passwordText">Password: </label>
					    <input name="password" type="password" id="passwordText" />
                    </div>
					<button type="submit" name="send" class="submit-form">Подтвердить</button>`
		);
		parentEl.appendChild(this.item);
	}

	get() {
		return this.item;
	}
}

BtnLogin.addEventListener('click', runWindow);

function runWindow() {
	const popUp = new popUpModal(body);
	const PopUpWindow = popUp.get();
	const form = new Form(PopUpWindow);
	const formConfrimCheck = form.get();

	AuthorizationCall(formConfrimCheck, PopUpWindow);
}

function AuthorizationCall(formConfrimCheck, PopUpWindow) {
	formConfrimCheck.addEventListener('submit', async function (e) {
		e.preventDefault();
		let inputEmailValue = formConfrimCheck.children[0].children[1];
		let passwordInput = formConfrimCheck.children[1].children[1];
		let emailValue = inputEmailValue.value;
		let passwordValue = passwordInput.value;

		const authObj = {
			email: emailValue,
			password: passwordValue,
		};

		if (inputEmailValue.value.trim() === '') {
			inputEmailValue.value = '';
			return;
		}

		const response = await fetch(
			'https://ajax.test-danit.com/api/cards/login',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},

				body: JSON.stringify(authObj),
			}
		);

		const data = await response.text();

		if (response.status === 200) {
			localStorage.setItem('token', data);
			checkToken();
			removeElement(PopUpWindow);
		}
	});
}
function removeElement(el) {
	el.remove();
}

function checkToken() {
	let getToken = localStorage.getItem('token');

	if (getToken) {
		BtnCreate.style.display = 'block';
		BtnLogin.style.display = 'none';
		textNoItem.remove();
		filter.style.display = 'flex';
		getData(getToken);
	}
}
async function getData(token) {
	const response = await fetch('https://ajax.test-danit.com/api/cards', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await response.json();

	render(data);
}
function render(items) {
	containerCards.innerHTML = '';
	items.forEach((item) => {
		let name = item.content.name;
		let doctor = item.content.doctor;
		const cardContainer = document.createElement('div');
		cardContainer.classList.add('card');
		cardContainer.insertAdjacentHTML(
			'beforeend',
			`	<p class="name">${name}</p>
				<p class="doctor">${doctor}</p>`
		);
		containerCards.appendChild(cardContainer);
	});
}

// function testDELETE(items) {
// 	console.log(items);
// }
// fetch('https://ajax.test-danit.com/api/v2/cards/4117', {
// 	method: 'DELETE',
// 	headers: {
// 		Authorization: 'Bearer 2c13322e-7afc-47be-aa96-4bda80f5585a',
// 	},
// });
