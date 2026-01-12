import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;

  async function login(email, password) {
    const data = await loginRequest(email, password);

    // mesmo formato do seu backend atual
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.pessoa));

    setToken(data.token);
    setUser(data.pessoa);

    navigate("/dashboard");
  }

  function logout() {
    localStorage.clear();
    setToken(null);
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
