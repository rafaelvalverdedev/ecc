import supabase from "../config/supabase.js";

export const resetDatabase = async (req, res) => {
  try {
    // Executa TRUNCATE em todas as tabelas
    const { error } = await supabase.rpc("reset_ecc_data");

    if (error) {
      console.error("Erro ao resetar banco:", error);
      return res.status(500).json({ error: "Erro ao limpar o banco" });
    }

    return res.json({ message: "Banco limpo com sucesso!" });
  } catch (err) {
    console.error("Erro geral:", err);
    res.status(500).json({ error: "Erro inesperado ao limpar o banco" });
  }
};
