import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("https://ecc-backend-8i9l.onrender.com/auth/login", {
        email,
        password,
      });

      login(res.data.pessoa, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Credenciais inválidas");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Login ECC</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}




