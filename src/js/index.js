const body = document.querySelector('body');
const BtnLogin = document.querySelector('.btn-login');
const BtnCreate = document.querySelector('.btn-create');
const textNoItem = document.querySelector('.no-item');
const filter = document.querySelector('.filter');
const containerCards = document.querySelector('.cards');

checkToken();

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
