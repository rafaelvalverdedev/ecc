# React + Vite

npm create vite@latest ecc-frontend-vite -- --template react // criação do projeto React + Vite
npm install // Instalação dos pacotes
npm install react-router-dom @supabase/supabase-js // Adicionando os pacotes de Rotas e Banco de Dados Supabase

## Comando para criação de estrutura das pastas e arquivos do projeto
```Bash
@('src/app', 'src/components', 'src/pages', 'src/services', 'src/hooks', 'src/contexts', 'src/styles') | ForEach-Object { if (!(Test-Path $_)) { New-Item -ItemType Directory -Path $_ } }; @('src/app/routes.jsx', 'src/app/router.jsx', 'src/components/Button.jsx', 'src/components/Input.jsx', 'src/components/Loader.jsx', 'src/pages/Login.jsx', 'src/pages/Dashboard.jsx', 'src/pages/Eventos.jsx', 'src/pages/NotFound.jsx', 'src/services/supabaseClient.js', 'src/services/authService.js', 'src/services/eventosService.js', 'src/hooks/useAuth.js', 'src/contexts/AuthContext.jsx', 'src/styles/global.css', 'src/App.jsx', 'src/main.jsx') | ForEach-Object { if (!(Test-Path $_)) { New-Item -ItemType File -Path $_ } }
```

