# 📸 Fotógrafo+
Projeto avaliativo desenvolvido para a disciplina de PROJETOS INTEGRADOS DE APLICAÇÕES da Pós Graduação em Desenvolvimento Web Full Stack na PUC MINAS.
Fotógrafo+ é Plataforma digital desenvolvida para fotógrafos profissionais e amadores, permitindo gerenciar portfólios, agenda de ensaios e credenciais de acesso de forma simples, moderna e integrada à nuvem.

---

## Sumário
- [Sobre o projeto](#sobre-o-projeto)
- [Principais funcionalidades](#principais-funcionalidades)
- [Arquitetura e tecnologias](#arquitetura-e-tecnologias)
- [Deploy e CI/CD](#deploy-e-cicd)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Instalação e execução local](#instalação-e-execução-local)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Testes automatizados](#testes-automatizados)
- [Autenticação OAuth Google](#autenticação-oauth-google)
- [Rotas principais da API](#rotas-principais-da-api)
- [Dicas de debug](#dicas-de-debug)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Sobre o projeto
O Fotógrafo+ centraliza em uma única plataforma o gerenciamento de atividades fotográficas, permitindo:

- Criar e exibir portfólios com imagens enviadas pelo usuário autenticado;
- Gerenciar agendamentos com data, título e descrição;
- **Autenticar via JWT** ou com **Google OAuth 2.0**;
- **Alterar credenciais** (senha e dados do usuário) diretamente pela aplicação;
- Consumir API hospedada na **Azure Web App**, com frontend publicado na **Vercel**.

---

## Principais funcionalidades

Autenticação e autorização:
- Login e registro via **JWT**  
- Login alternativo via **OAuth Google**  
- Alteração de senha com persistência segura no banco  

Entidades e CRUDs:
- **Portfólio** — upload, visualização, edição e exclusão de imagens  
- **Agenda** — criação, listagem, atualização e exclusão de compromissos (vinculados ao usuário logado)

Infraestrutura:
- Banco de dados **MongoDB Atlas**  
- Deploy backend em **Azure Web App**  
- Deploy frontend em **Vercel**  
- CI/CD com **GitHub Actions**  
- Suporte a testes end-to-end no frontend (**Cypress**) 
- Testes automatizados no backend (**Jest, EM DESENVOLVIMENTO**)  
---

##  Arquitetura e tecnologias

FotografoPlus/  
├── backend/ # Node.js + Express + MongoDB  
│ ├── src/  
│ │ ├── config/  
│ │ ├── controllers/  
│ │ ├── middlewares/  
│ │ ├── models/  
│ │ ├── routes/
│ │ └── tests/ 
│ │ ├── app.js
│ │ ├── server.js
│ ├── .env 
│ ├── .gitignore
│ ├── jest.config.cjs
│ └── package.json  
│  
├── frontend/ # React + Vite  
│ ├── src/ 
│ │ ├── assets/ 
│ │ ├── components/
│ │ ├── context/
│ │ ├── hooks/
│ │ ├── pages/
│ │ ├── routes/
│ │ ├── services/ 
│ │ ├── styles/
│ │ ├── App.css
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── .env 
│ ├── .gitignore
│ ├── cypress.config.js
│ ├── index.html
│ ├── package.json
│ ├── vercel.json 
│ └── vite.config.js  
│
└── .github/workflows/  
├── ci.yml # CI/CD pipeline com Vercel + Render (o Render não é mais usado no projeto, está presente apenas para mostrar que ja foi utilizado anteriormente e que também é possivel utiliza-lo) 
└── main_fotografoplus.yml # Deploy backend na Azure

### 💡 Evolução e Status

| Requisito | Status | Detalhes |
| :--- | :--- | :--- |
| **Tratamento de Logs** | Parcial | Logs básicos via `console.log/error`. Pronta para expansão com Winston/Morgan. |
| **Testes Automatizados** | Parcial | Cobertura de ~70% no backend (Jest, **ainda não commitado**) e testes e2e iniciais no frontend (Cypress). |
| **Funcionalidade Adicional** | Em Planejamento | Estrutura modular preparada para integração de serviços de IA (análise de imagens). |

---
## ☁️ Deploy e CI/CD
- **Frontend:**  
  📍 [https://fotografo-plus.vercel.app](https://fotografo-plus.vercel.app)

- **Backend (Azure Web App):**  
  📍 [https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net](https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net)

- **CI/CD:**  
  - GitHub Actions compila e executa testes a cada push na branch `main`.  
  - O frontend é publicado automaticamente na **Vercel**.  
  - O backend é publicado automaticamente na **Azure**, com build e upload configurados no workflow `main_fotografoplus.yml`.

---

## 🧩 Pré-requisitos

- **Node.js ≥ 18**
- **npm ≥ 9**
- **MongoDB Atlas** (ou instância local)
- **Conta Google** (para autenticação OAuth)

Você também consegue se registrar com um email e senhas fakes para testar a aplicação!

---

## 🔐 Variáveis de ambiente

### 🔹 Backend (`backend/.env`)
```
MONGO_URI=<sua_string_mongodb_atlas>
DB_NAME=fotografo_plus
JWT_SECRET=<chave_segura>
JWT_EXPIRES_IN=7d
PORT=3000

GOOGLE_CLIENT_ID=<client_id_google>
GOOGLE_CLIENT_SECRET=<client_secret_google>

GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback ou https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net/api/auth/google/callback
- Essa variável acima é usada pelo backend (Passport Google Strategy) para receber o retorno da autenticação do Google.

FRONTEND_URL=https://fotografo-plus.vercel.app
```
### 🔹 Frontend (`frontend/.env`)
```
VITE_API_URL=https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net
```
Servidor local: **[http://localhost:3000](http://localhost:3000)**

🚀 Instalação e execução local

🖥️ Backend
```
cd backend
npm install
npm run dev
```
💻 Frontend
```
cd frontend
npm install
npm run dev
```
Aplicação local: **[http://localhost:5173](http://localhost:5173)**

## 🧪 Testes automatizados

🔹 Frontend — Cypress
```
cd frontend
npx cypress open
#ou modo headless:
npx cypress run
```
-   Local dos testes: `frontend/cypress/e2e/`
    
-   Simula navegação, login e operações CRUD no navegador.
## 🔑 Autenticação OAuth Google

O projeto suporta **autenticação via Google**, além do login tradicional.

### 🔸 Fluxo:

1.  O usuário clica em “Login com Google”.
2.  É redirecionado à tela de consentimento Google.
3.  Após o login, a API (backend) recebe o `code` e gera um token JWT.
4.  O backend redireciona para o frontend (`FRONTEND_URL`) com o token.
5.  O `AuthContext` armazena o token no `localStorage` e gerencia a sessão.

### 🔸 Arquivo de configuração
`backend/src/config/googleAuth.js`

### 🔸 Callback
`https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net/api/auth/google/callback`

##  Rotas principais da API

## Autenticação

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Cria novo usuário |
| POST | `/api/auth/login` | Login JWT |
| GET | `/api/auth/google` | Inicia OAuth |
| GET | `/api/auth/google/callback` | Callback do OAuth |
| PATCH | `/api/auth/update-password` | Altera senha do usuário autenticado |

## Portfólio

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/portfolio` | Lista fotos do usuário |
| POST | `/api/portfolio` | Cria novo item |
| PUT | `/api/portfolio/:id` | Atualiza título/descrição |
| DELETE | `/api/portfolio/:id` | Exclui item |

## Agendamento

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/schedules` | Lista agendamentos |
| POST | `/api/schedules` | Cria agendamento |
| PUT | `/api/schedules/:id` | Atualiza |
| DELETE | `/api/schedules/:id` | Exclui |

## Dicas de debug

-   **Erro 401:** token ausente ou expirado. Faça login novamente.
    
-   **Erro CORS:** verifique `FRONTEND_URL` e `CORS` configurados no backend.
    
-   **Erro 404 em imagens:** a API gera `imageUrl` dinâmico — verifique o campo `BASE_URL` no backend.
    
-   **Testes falhando:** confirme variáveis `MONGO_URI_TEST` e isolamento de banco.

## 📜 Licença
Projeto acadêmico. Uso livre para fins de estudo e portfólio.

🧩 **Autor:** Jean Carlos Oliveira da Silva  
💬 **Backend:** Azure Web App  
🌐 **Frontend:** Vercel  
📂 **Banco:** MongoDB Atlas  
🔑 **Autenticação:** JWT + OAuth Google  
🧪 **Testes:** Jest (backend) + Cypress (frontend)
