import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { apiFetch } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      const response = await apiFetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: senha, }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao autenticar')
      }

      const data = await response.json()

      localStorage.setItem('token', data.token)
      login(data.pessoa)

      navigate('/dashboard');

    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '50px auto' }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Senha</label><br />
          <input
            type="password"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}
    </div>
  )
}
