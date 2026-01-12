// modules/vinculos.js
import { apiGet, apiPost } from "./api.js";

let modalCarregado = false;

export async function carregarModalVinculo() {
  if (modalCarregado) return;

  const res = await fetch(`${window.location.origin}/components/modal-vinculo.html`);
  const html = await res.text();

  document.body.insertAdjacentHTML("beforeend", html);
  modalCarregado = true;

  document
    .getElementById("form-vinculo")
    .addEventListener("submit", salvarVinculo);
}

export async function abrirModalVinculo(eventoId) {
  await carregarModalVinculo();

  console.log(eventoId)
  document.getElementById("card-vincular").style.display = "block";

  await preencherEventos(eventoId);
  await preencherEquipes(eventoId);
}

export function fecharModalVinculo() {
  document.getElementById("card-vincular").style.display = "none";
}

async function preencherEventos(eventoId) {
  const eventos = await apiGet("/eventos");
  const select = document.getElementById("evento_id");

  select.innerHTML = "";

  eventos.forEach(ev => {
    const opt = document.createElement("option");
    opt.value = ev.id;
    opt.textContent = ev.nome;
    if (ev.id === eventoId) opt.selected = true;
    select.appendChild(opt);
  });

  select.disabled = true;
}

async function preencherEquipes(eventoId) {
  const equipes = await apiGet(`/equipes-evento/evento/${eventoId}`);
  const select = document.getElementById("equipe_id");

  select.innerHTML = `<option value="">Selecione</option>`;

  equipes.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.equipe.id;
    opt.textContent = v.equipe.nome;
    select.appendChild(opt);
  });
}

async function salvarVinculo(e) {
  e.preventDefault();

  const data = {
    evento_id: document.getElementById("evento_id").value,
    equipe_id: document.getElementById("equipe_id").value
  };

  await apiPost("/equipes-evento", data);

  alert("Equipe vinculada com sucesso!");
  fecharModalVinculo();
}
