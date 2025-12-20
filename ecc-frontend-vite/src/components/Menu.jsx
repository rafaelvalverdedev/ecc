import { Link } from 'react-router-dom'
import { menuItems } from '../config/menu'
import { permissions } from '../config/permissions'
import { useAuth } from '../contexts/AuthContext'

export default function Menu() {
  const { user } = useAuth()

  if (!user) return null

  const userPermissions = permissions[user.role] || {}

  return (
    <nav>
      <ul>
        {menuItems.map(item => {
          if (!userPermissions[item.permission]) return null

          return (
            <li key={item.path}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
