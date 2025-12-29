// modules/eventos.js

import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

// =====================
// READ
// =====================
export async function listarEventos() {
  return await apiGet("/eventos");
}

export async function buscarEvento(id) {
  return await apiGet(`/eventos/${id}`);
}

// =====================
// CREATE
// =====================
export async function criarEvento(data) {
  return await apiPost("/eventos", data);
}

// =====================
// UPDATE
// =====================
export async function atualizarEvento(id, data) {
  return await apiPut(`/eventos/${id}`, data);
}

// =====================
// DELETE
// =====================
export async function excluirEvento(id) {
  return await apiDelete(`/eventos/${id}`);
}
