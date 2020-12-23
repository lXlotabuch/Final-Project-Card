import { render } from "./render.js";
import { removeEl } from "./servises.js";

const URL = "https://ajax.test-danit.com/api";

export async function getItemsFromSer() {
  const res = await fetch(URL + "/cards", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
  });
  const data = await res.json();
  return data;
}

export async function postCard(card) {
  const res = await fetch(URL + "/cards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: JSON.stringify(card),
  });
  const data = await res.json();

  if (res.status === 200) {
    removeEl(document.querySelector(".modalDiv"));
    render(data);
  }
}

export async function getOneCard(card) {
  const res = await fetch(URL + "/cards/" + card.dataset.id, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
    },
  });

  const data = await res.json();

  return data;
}

export async function putCard(card, data) {
  const res = await fetch(URL + "/cards/" + card.dataset.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`,
    },
    body: JSON.stringify(data),
  });
  return res;
}

export async function Authorization(authObj) {
  const res = await fetch(URL + "/cards/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(authObj),
  });

  const data = await res.text();

  return [res, data];
}

export async function deleteCard(id) {
  const res = await fetch(URL + "/cards/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res;
}
