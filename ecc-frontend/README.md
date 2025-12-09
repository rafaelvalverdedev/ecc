# 🚀 ECC Frontend  
Frontend oficial do Sistema ECC, desenvolvido com **React + Vite**, **Context API**, **Axios**, e **React Router Dom**.

# Visão Geral

        O frontend foi construído com:
        React + Vite (estrutura moderna e rápida)
        React Router Dom (controle de rotas)
        Axios (requisições para o backend)
        Context API (controle de autenticação global)
        LocalStorage (persistência do token)
        Proteção de rotas via componente PrivateRoute
        Toda a comunicação é feita com o backend em:
        --
        Este projeto se conecta ao backend em:  
        https://ecc-backend-8i9l.onrender.com

---

# 📦 1. Instalação

Certifique-se de ter **Node.js 18+** instalado.

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/ecc-frontend.git

# Acesse a pasta
cd ecc-frontend

# Instale as dependências
npm install



##🧱 1. Estrutura Geral do Projeto

#Estrutura baseada nos arquivos enviados:
```bash
    src/
    ├── api/                 (não utilizado ainda, reservado para serviços)
    ├── auth/
    │    ├── AuthContext.jsx
    │    └── PrivateRoute.jsx
    ├── components/          (componentes futuros)
    ├── pages/
    │    ├── Login.jsx
    │    ├── Dashboard.jsx
    │    └── ... futuras páginas
    ├── App.jsx
    ├── main.jsx
    └── index.css
```


# 🔐 2. Sistema de Autenticação (AuthContext)

O arquivo mais importante é AuthContext.jsx

AuthContext
✔ O que ele faz?
    Controla o estado global do usuário.
    Armazena e mantém o token JWT.
    Permite login() e logout() de qualquer lugar do app.
    Persiste o token no localStorage para manter o usuário logado após atualizar a página.