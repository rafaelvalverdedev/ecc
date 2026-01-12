import { useEffect, useState, Image } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useLoader } from "../contexts/LoaderContext";

import "./auth.css";
import "../styles/formularios.css";

import logo from "../../public/Logo-v2-2025-logo.png";


function Login() {
  const { login, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { withLoader } = useLoader();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    await withLoader(async () => {
      try {
        await login(email, password);
        showToast("Login realizado com sucesso", "success");
        // navigate acontece no AuthContext
      } catch (err) {
        console.error(err);
        showToast(err?.error || "Erro ao autenticar", "error");
      }
    });
  }

  return (

    <div className="container">
      <div className="card-modal-login">
        <div className="logo">
          <img src={logo} />
        </div>
        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
