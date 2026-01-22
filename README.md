# Sistema de Gestão para Igrejas

Sistema simples e direto para gestão de membros, financeiro e relatórios.

## Funcionalidades

✓ Cadastro de membros com busca e filtros  
✓ Controle financeiro mensal (caixa fechado após o mês)  
✓ Relatórios em PDF  
✓ Controle de acesso por perfil (Pastor, Tesoureiro, Secretário)  
✓ Interface moderna e responsiva

## Tecnologias

- Backend: Node.js + TypeScript + Express
- Frontend: React + TypeScript + Tailwind CSS
- Banco: Neon (PostgreSQL serverless)
- Deploy: Vercel

## Instalação Rápida

### 1. Criar banco no Neon

1. Acesse: https://neon.tech
2. Crie conta grátis
3. Crie novo projeto
4. Copie a connection string

### 2. Configurar projeto

```bash
# Clonar/baixar projeto
cd church-management

# Instalar dependências
npm install

# Criar backend/.env
DATABASE_URL=sua-connection-string-do-neon
JWT_SECRET=qualquer-string-aleatoria
NODE_ENV=development
PORT=5000
```

### 3. Configurar banco

```bash
cd backend

# Criar tabelas
node setup-db.js

# Criar usuário admin
node create-admin.js pastor admin123 pastor
```

### 4. Rodar localmente

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Acesse: http://localhost:3000

**Login:** pastor / admin123

## Perfis de Acesso

- **Pastor**: Acesso total ao sistema
- **Tesoureiro**: Apenas financeiro e relatórios
- **Secretário**: Apenas membros e relatórios

## Perfis de Acesso

- **Pastor**: Acesso total
- **Tesoureiro**: Apenas financeiro e relatórios
- **Secretário**: Apenas membros e relatórios

## Estrutura

```
church-management/
├── backend/          # API Node.js
├── frontend/         # Interface React
└── database/         # Schema SQL
```

## Modelo de Negócio

- SaaS mensal: R$ 39 (pequena) / R$ 79 (média)
- Setup inicial: R$ 199
- Foco em desktop/web


## Deploy no Vercel

Ver instruções completas em `DEPLOY.md`

**Resumo:**
1. Criar banco no Neon (grátis)
2. Rodar `npm run setup-db` para criar tabelas
3. Rodar `npm run create-admin` para criar usuário
4. Deploy no Vercel via CLI ou GitHub
5. Configurar variáveis de ambiente no Vercel

**Custo:** R$ 0 (free tier Neon + Vercel)
