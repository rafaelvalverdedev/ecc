// modules/equipes-evento.js
import { apiGet, apiPost, apiDelete } from "./api.js";

// Lista equipes vinculadas a um evento
export async function listarEquipesDoEvento(eventoId) {
  return await apiGet(`/equipes-evento/evento/${eventoId}`);
}

// Vincula uma equipe a um evento
export async function vincularEquipeAoEvento(eventoId, equipeId) {
  return await apiPost("/equipes-evento", {
    evento_id: eventoId,
    equipe_id: equipeId
  });
}

// Remove vínculo equipe ↔ evento
export async function desvincularEquipeDoEvento(vinculoId) {
  return await apiDelete(`/equipes-evento/${vinculoId}`);
}
