// modules/cadastro.js
import { apiGet } from "./api.js";

export async function listarCadastros() {
  return await apiGet("/cadastro");
}
