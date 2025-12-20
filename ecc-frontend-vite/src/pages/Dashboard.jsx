import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {user && (
        <>
          <p>Bem-vindo, {user.nome}</p>
          <p>Perfil: {user.role}</p>
          <button onClick={handleLogout}>Sair</button>
        </>
      )}
    </div>
  )
}
