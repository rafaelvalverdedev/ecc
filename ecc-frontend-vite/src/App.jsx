import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Inicio from './pages/inicio';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import ProtectedRoute from './routes/ProtectedRoute';
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Pública */}
        <Route path="/" element={<Inicio />} />
        <Route path="/Login" element={<Login />} />


        {/* Protegida para qualquer logado */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protegida só para admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} /> {/* Rota 404 (sempre por último) */}
      </Routes>
    </BrowserRouter>
  )
}
