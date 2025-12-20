import { useNavigate } from 'react-router-dom'
import { logout, getUser } from '../services/authService'

export default function Admin() {
    const navigate = useNavigate()
    const user = getUser()

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
                    <p>Perfil: {user.email}</p>
                    <p>Perfil: {user.telefone}</p>
                    <button onClick={handleLogout}>Sair</button>
                </>
            )}
        </div>
    )
}
