// modules/equipes.js
import { apiGet } from "./api.js";

export async function listarEquipes() {
  return await apiGet("/equipes");
}
