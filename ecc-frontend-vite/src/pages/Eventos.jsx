import { useEffect, useState } from "react";
import { listarEventos } from "../services/eventos.service";
import { useLoader } from "../contexts/LoaderContext";
import { useToast } from "../contexts/ToastContext";

import LogoutButton from "../components/common/LogoutButton";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [erro, setErro] = useState(null);
  const { withLoader } = useLoader();
  const { showToast } = useToast();



  useEffect(() => {
    withLoader(async () => {
      try {
        const data = await listarEventos();
        setEventos(data);
      } catch (err) {
        showToast("Erro ao carregar eventos", "error");
      }
    });
  }, []);

  if (erro) return <p>{erro}</p>;

  return (
    <>
      <h2>Eventos</h2>
      <ul>
        {eventos.map(ev => (
          <li key={ev.id}>{ev.nome}</li>
        ))}
      </ul>
    </>
  );
}

export default Eventos;
