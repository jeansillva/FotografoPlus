# 📸 Fotógrafo+

Fotógrafo+ é uma plataforma moderna para gerenciamento de portfólios e agendamentos fotográficos, integrando IA e autenticação segura.

Projeto avaliativo desenvolvido para a disciplina de PROJETOS INTEGRADOS DE APLICAÇÕES da Pós Graduação em Desenvolvimento Web Full Stack na PUC MINAS

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

- Criar e exibir **Portfólios organizados em Álbuns** com imagens enviadas pelo usuário autenticado;
- Gerenciar agendamentos com data, título e descrição;
- **Autenticar via JWT** ou com **Google OAuth 2.0**;
- **Alterar credenciais** (senha e dados do usuário) diretamente pela aplicação;
- Integrar **Inteligência Artificial** (TensorFlow.js) para gerar metadados de imagens;
- Consumir API hospedada na **Azure Web App**, com frontend publicado na **Vercel**.
- Gerar título e legendas com IA (TensorFlow) para as fotos que forem subidas no porfólio

---

## Principais funcionalidades

Autenticação e autorização:
- Login e registro via **JWT**  
- Login alternativo via **OAuth Google**  
- Alteração de senha com persistência segura no banco  

Entidades e CRUDs:
-  **Portfólio**  — upload, visualização, edição e exclusão de imagens
- **(Álbuns e Fotos)** — Implementação **mestre-detalhe** para organização em álbuns que contêm várias fotos, permitindo gestão de álbuns e fotos separadamente.
- **Agenda** — criação, listagem, atualização e exclusão de compromissos (vinculados ao usuário logado)
- **Usuário** - criação e edição de credenciais de usuários.

Infraestrutura:
- Banco de dados **MongoDB Atlas**  
- Deploy backend em **Azure Web App**  
- Deploy frontend em **Vercel**  
- CI/CD com **GitHub Actions**  
- **Tratamento de Logs** completo e robusto.
- **Testes automatizados no backend (Jest, CONCLUÍDO)**
- Suporte a testes end-to-end no frontend (**Cypress**) 
- **Inteligência Artificial (TensorFlow.js)** rodando no cliente para análise de imagens e geração automática de título e descrição.

---

##  Arquitetura e tecnologias

```tree
FotografoPlus/
├── backend/ # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── tests/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   ├── jest.config.cjs
│   └── package.json
│
├── frontend/ # React + Vite
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── cypress.config.js
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
└── .github/workflows/
    ├── ci.yml # CI/CD pipeline com Vercel + Render (o Render não é mais usado no projeto, está presente apenas para mostrar que ja foi utilizado anteriormente e que também é possível utiliza-lo)
    └── main_fotografoplus.yml # Deploy backend na Azure
  ```
    
## Deploy e CI/CD
- **Frontend:**  
  📍 [https://fotografo-plus.vercel.app](https://fotografo-plus.vercel.app)

- **Backend (Azure Web App):**  
  📍 [https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net](https://fotografoplus-cuaxeebdhugherfa.canadacentral-01.azurewebsites.net)
  
- **CI/CD:**  
  - GitHub Actions compila e executa testes a cada push na branch `main`.  
  - O frontend é publicado automaticamente na **Vercel**.  
  - O backend é publicado automaticamente na **Azure**, com build e upload configurados no workflow `main_fotografoplus.yml`.

## Pré-requisitos

- **Node.js ≥ 18**
- **npm ≥ 9**
- **MongoDB Atlas** (ou instância local)
- **Conta Google** (para autenticação OAuth)

Você também consegue se registrar com um email e senhas fakes para testar a aplicação!

---

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

## Instalação e execução local:

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

##  Testes automatizados

Para executar os testes do projeto:

### 🖥️ Backend
```bash
cd backend
npm run test
```
**Local dos testes:** `backend/src/tests/`

### 💻 Frontend — Cypress
```bash
cd frontend
npx cypress open
```
**Local dos testes:** `frontend/cypress/e2e/`

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

## Rotas principais da API

## Autenticação

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Cria novo usuário |
| POST | `/api/auth/login` | Login JWT |
| GET | `/api/auth/google` | Inicia OAuth |
| GET | `/api/auth/google/callback` | Callback do OAuth |
| PATCH | `/api/auth/update-password` | Altera senha do usuário autenticado |

ATENÇÃO: O primeiro acesso na aplicação pode levar alguns segundos por se tratar de planos gratuitos das plataformas em nuvens utilizadas.

Para facilitar a avaliação, o sistema permite registrar contas com e‑mails fictícios (não é necessário usar um e‑mail real) e o login com Google também permite acesso á aplicação.  

Caso necessite de um usuário pré cadastrado utilize as credenciais abaixo:
```
Email: jean.teste@fotografo.com  
Senha: Foto@@
```

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

## Álbum

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| **Álbuns (Mestre)** | | |
| POST | `/api/portfolio` | Cria novo Álbum e realiza upload de múltiplas fotos |
| GET | `/api/portfolio` | Lista todos os Álbuns do usuário |
| PUT | `/api/portfolio/:id` | Atualiza título/descrição do Álbum |
| DELETE | `/api/portfolio/:id` | Exclui o Álbum e todas as Fotos associadas |
| **Fotos (Detalhe)** | | |
| POST | `/api/portfolio/:id/photos` | Adiciona uma nova Foto ao Álbum especificado por id |
| PUT | `/api/portfolio/:albumId/photos/:photoId` | Atualiza título/descrição de uma Foto específica |
| DELETE | `/api/portfolio/:albumId/photos/:photoId` | Exclui uma Foto específica de um Álbum |

## 📜 Licença
Projeto acadêmico. Uso livre para fins de estudo e portfólio.

🧩 **Autor:** Jean Carlos Oliveira da Silva  
💬 **Backend:** Azure Web App  
🌐 **Frontend:** Vercel  
📂 **Banco:** MongoDB Atlas  
🔑 **Autenticação:** JWT + OAuth Google  
🧪 **Testes:** Jest (backend) + Cypress (frontend)
