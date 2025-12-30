// modules/dashboard.js
import { listarEventos } from "./eventos.js";
import { listarEquipes } from "./equipes.js";
import { listarCadastros } from "./cadastro.js";
import { listarPessoas } from "./pessoas.js";

export async function carregarDashboard() {
  const [eventos, equipes, cadastros, pessoas] = await Promise.all([
    listarEventos(),
    listarEquipes(),
    listarCadastros(),
    listarPessoas()
  ]);

  return {
    eventos,
    equipes,
    cadastros,
    pessoas,
    resumo: {
      totalEventos: eventos.length,
      totalEquipes: equipes.length,
      totalCadastros: cadastros.length,
      totalPessoas: pessoas.length
    }
  };
}

export function abrirEvento(eventoId) {
  localStorage.setItem("eventoId", eventoId);
  window.location.href = `${window.location.origin}/eventos/detalhe`;
}
