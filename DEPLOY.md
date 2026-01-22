# Deploy no Vercel com Neon

## 1. Criar banco no Neon

1. Acessar: https://neon.tech
2. Criar conta (grátis)
3. Clicar em "Create Project"
4. Escolher região (US East recomendado para Vercel)
5. Copiar a **Connection String**

Exemplo:
```
postgresql://user:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## 2. Configurar tabelas no Neon

### Opção A: Via Neon Console (recomendado)
1. No painel do Neon, clicar em "SQL Editor"
2. Copiar todo conteúdo de `database/schema.sql`
3. Colar e executar

### Opção B: Via script local
1. Criar `backend/.env` com a connection string do Neon
2. Rodar:
```bash
cd backend
npm install
npm run setup-db
```

## 3. Criar usuário admin

Com o `.env` configurado:
```bash
cd backend
npm run create-admin pastor admin123 pastor
```

## 4. Deploy no Vercel

### Via CLI (recomendado):

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

### Via Dashboard:

1. Acessar: https://vercel.com
2. Importar repositório do GitHub
3. Configurar variáveis de ambiente:
   - `DATABASE_URL`: connection string do Neon
   - `JWT_SECRET`: string aleatória (ex: `minha-chave-super-secreta-123`)
4. Deploy

## 5. Configurar variáveis no Vercel

No dashboard do Vercel:
1. Ir em Settings > Environment Variables
2. Adicionar:

```
DATABASE_URL = postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
JWT_SECRET = sua-chave-secreta-aleatoria
NODE_ENV = production
```

## 6. Testar

Acessar a URL do Vercel e fazer login:
- Username: `pastor`
- Senha: `admin123`

---

## Custos

- **Neon Free Tier**: 
  - 0.5 GB storage
  - 3 projetos
  - Suficiente para começar

- **Vercel Free Tier**:
  - 100 GB bandwidth
  - Domínio .vercel.app
  - Suficiente para MVP

## Estrutura de Deploy

```
Vercel (Frontend + API)
    ↓
Neon (PostgreSQL)
```

Tudo serverless, zero manutenção de servidor!
