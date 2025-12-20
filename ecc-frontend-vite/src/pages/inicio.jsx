import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Inicio</h1>
      <p>==========================</p>

      <Link to="/Login">Ir para Inicio</Link>
    </div>
  )
}
