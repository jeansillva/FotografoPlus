# 📸 Fotógrafo+

Plataforma digital voltada para fotógrafos que desejam iniciar ou expandir seus trabalhos, permitindo a criação de portfólios, gerenciamento de agenda e conexão direta com clientes.

---

## Objetivo
O Fotógrafo+ busca centralizar em uma única aplicação:
- Criação e exibição de portfólios.
- Agendamento de sessões fotográficas.
- Comunicação simplificada entre fotógrafos e clientes.
- Uso de serviços externos para armazenamento de imagens e envio de notificações (e-mail).

No futuro, o sistema contemplará tanto a experiência do fotógrafo quanto a experiência do cliente, mas neste momento o foco inicial está na interface e nas funcionalidades voltadas ao fotógrafo.

---

## Tecnologias
- Frontend: React + Vite  
- Backend: Node.js + Express + MongoDB  
- Infra:  
  - Banco de Dados → MongoDB Atlas  
  - Armazenamento de Imagens → AWS S3  
  - E-mails → SendGrid  

---

## Status Atual
Atualmente o projeto encontra-se na fase inicial de desenvolvimento, com foco em:
- Organização da estrutura de front e backend.  
- Configuração de pipeline CI/CD o.  
- Deploy do frontend já realizado com sucesso na Vercel.

## CI/CD
O repositório utiliza:
- GitHub Actions para integração contínua (build e instalação de dependências em cada push/pull).  
- Vercel para deploy automático do frontend.  

Pipeline configurado:  
1. A cada push na branch main, o GitHub Actions valida o projeto.  
2. O frontend é automaticamente publicado na Vercel.  
