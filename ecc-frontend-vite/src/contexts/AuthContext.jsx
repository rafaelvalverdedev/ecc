import { createContext, useContext, useState, useEffect } from 'react'
import { logout as serviceLogout } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')

        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        setLoading(false)
    }, [])

    function login(userData) {
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    function logout() {
        serviceLogout()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
