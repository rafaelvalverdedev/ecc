import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) return null

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
