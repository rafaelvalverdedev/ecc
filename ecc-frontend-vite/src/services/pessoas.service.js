// modules/pessoas.js
import { apiGet } from "./api.js";

export async function listarPessoas() {
  return await apiGet("/pessoas");
}
