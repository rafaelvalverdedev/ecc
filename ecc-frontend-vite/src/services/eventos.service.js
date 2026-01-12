import { apiGet, apiPost, apiPut, apiDelete } from "./api";

export function listarEventos() {
  return apiGet("/eventos");
}

export function buscarEvento(id) {
  return apiGet(`/eventos/${id}`);
}

export function criarEvento(data) {
  return apiPost("/eventos", data);
}

export function atualizarEvento(id, data) {
  return apiPut(`/eventos/${id}`, data);
}

export function excluirEvento(id) {
  return apiDelete(`/eventos/${id}`);
}
