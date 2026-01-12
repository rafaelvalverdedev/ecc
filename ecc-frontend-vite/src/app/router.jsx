import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

import ProtectedRoute from "../components/common/ProtectedRoute";
import Layout from "../components/layout/Layout";

import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Eventos from "../pages/Eventos";
import Equipes from "../pages/Equipes";
import Cadastro from "../pages/Cadastro";
import Pessoas from "../pages/Pessoas";

function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/auth"
                        element={
                            <Auth />
                        }
                    />

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

                    <Route
                        path="/eventos"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Eventos />
                                </Layout>
                            </ProtectedRoute>
                        } />

                    <Route
                        path="/equipes"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Equipes />
                                </Layout>
                            </ProtectedRoute>} />

                    <Route
                        path="/cadastro"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Cadastro />
                                </Layout>
                            </ProtectedRoute>
                        } />

                    <Route
                        path="/pessoas"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Pessoas />
                                </Layout>
                            </ProtectedRoute>
                        } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default AppRouter;
