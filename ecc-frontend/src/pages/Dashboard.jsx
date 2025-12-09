const URL = "https://ecc-backend-8i9l.onrender.com";

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    pessoas: 0,
    eventos: 0,
    equipes: 0,
    inscricoes: 0,
    equipesEvento: 0,
    momentos: 0,
  });

  const [eventos, setEventos] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [
          pessoasRes,
          eventosRes,
          equipesRes,
          inscricoesRes,
          equipesEventoRes,
          momentosRes
        ] = await Promise.all([
          axios.get(`${URL}/pessoas`, { headers }),
          axios.get(`${URL}/eventos`, { headers }),
          axios.get(`${URL}/equipes`, { headers }),
          axios.get(`${URL}/inscricoes`, { headers }),
          axios.get(`${URL}/equipes-evento`, { headers }),
          axios.get(`${URL}/momentos`, { headers }),
        ]);

        setStats({
          pessoas: pessoasRes.data.data.length,
          eventos: eventosRes.data.data.length,
          equipes: equipesRes.data.data.length,
          inscricoes: inscricoesRes.data.data.length,
          equipesEvento: equipesEventoRes.data.data.length,
          momentos: momentosRes.data.data.length,
        });

        setEventos(eventosRes.data.data);
        setPessoas(pessoasRes.data.data);

        setLoading(false);

      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      }
    }

    fetchStats();
  }, [token]);

  if (loading) {
    return <h2 style={{ padding: 20 }}>Carregando Dashboard...</h2>;
  }

  return (
    <>
      <div style={{ padding: "20px" }}>
        <h1>Dashboard Geral do ECC</h1>
        <button onClick={logout}>Sair</button>
        <p>Visão geral das informações cadastradas no sistema</p>

        {/* Cards */}
        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          <Card title="Pessoas" value={stats.pessoas} />
          <Card title="Eventos" value={stats.eventos} />
          <Card title="Equipes" value={stats.equipes} />
          <Card title="Inscrições" value={stats.inscricoes} />
          <Card title="Equipes Vinculadas a Eventos" value={stats.equipesEvento} />
          <Card title="Momentos do Evento" value={stats.momentos} />
        </div>
      </div>
      {/* Tabela de eventos */}
      <div style={{ marginTop: "40px" }}>
        <h2>Eventos cadastrados</h2>

        <table
          style={{
            width: "500px",
            borderCollapse: "collapse",
            marginTop: "20px",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            color: "red",
          }}
        >
          <thead style={{ background: "#eee" }}>
            <tr>
              <th>Nome</th>
              <th>Local</th>
              <th>Data início</th>
              <th>Capacidade</th>
            </tr>
          </thead>

          <tbody>
            {eventos.map((e) => (
              <tr key={e.id}>
                <td>{e.nome}</td>
                <td>{e.local}</td>
                <td>{e.start_date}</td>
                <td>{e.capacity ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabela de Pessoas */}
      <div style={{ marginTop: "40px" }}>
        <h2>Pessoas cadastrados</h2>

        <table
          style={{
            width: "500px",
            borderCollapse: "collapse",
            marginTop: "20px",
            background: "white",
            borderRadius: "10px",
            overflow: "hidden",
            color: "red",
          }}
        >
          <thead style={{ background: "#eee" }}>
            <tr>
              <th>Nome</th>
              <th>Local</th>
              <th>Data início</th>
              <th>Capacidade</th>
            </tr>
          </thead>

          <tbody>
            {pessoas.map((p) => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.local}</td>
                <td>{p.start_date}</td>
                <td>-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// Card separado e limpo
function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        textAlign: "center",
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "red",
      }}
    >
      <h2 style={{ fontSize: "32px", margin: 0 }}>{value}</h2>
      <p style={{ fontSize: "16px", color: "#444", marginTop: "10px" }}>
        {title}
      </p>
    </div>
  );
}
