# 🚀 Instruções de Deploy - Vercel

## ✅ Correções Aplicadas

1. ✅ Variáveis de ambiente corrigidas (DATABASE_URL sem `psql '...'`)
2. ✅ `vercel.json` configurado corretamente
3. ✅ Build do frontend testado e funcionando

---

## 📋 Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Conta no Neon (https://neon.tech) - banco já configurado
- Git instalado

---

## 🎯 Deploy via GitHub (Recomendado)

### 1. Fazer commit das alterações

```bash
git add .
git commit -m "fix: configurar deploy no Vercel"
git push origin main
```

### 2. Conectar no Vercel

1. Acesse: https://vercel.com/new
2. Clique em "Import Git Repository"
3. Selecione seu repositório
4. Clique em "Import"

### 3. Configurar Variáveis de Ambiente

No dashboard do Vercel, vá em **Settings > Environment Variables** e adicione:

```
DATABASE_URL = postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET = 6a4d2b240400a62c1b5bec652530247f51a890f3c2d6a22a426c3c8736ddeb8627be85159874a6fb5513e4e48e00a9b3bd4ed113678d800711dcc9ed6ca0213d

NODE_ENV = production
```

### 4. Deploy

Clique em **Deploy** e aguarde ~2 minutos.

---

## 🚀 Deploy via CLI (Alternativa)

### 1. Instalar Vercel CLI

```bash
npm i -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Deploy

```bash
vercel --prod
```

Siga as instruções e configure as variáveis quando solicitado.

---

## ✅ Verificar Deploy

Após o deploy, teste:

1. **API Health Check:**
   ```
   https://seu-projeto.vercel.app/api/health
   ```
   Deve retornar: `{"status":"ok","timestamp":"..."}`

2. **Frontend:**
   ```
   https://seu-projeto.vercel.app
   ```
   Deve carregar a tela de login

3. **Login:**
   - Usuário: `pastor`
   - Senha: `admin123`

---

## 🔧 Configuração do Projeto

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "npm install",
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Estrutura de Deploy

```
Vercel
├── Frontend (frontend/dist/) → Servido como estático
└── API (api/index.ts) → Serverless Function
```

---

## 🆘 Troubleshooting

### Erro: "No Output Directory named 'dist' found"
✅ **Resolvido!** O `vercel.json` agora aponta para `frontend/dist`

### Erro: "Cannot find module 'pdfkit'"
✅ **Resolvido!** `pdfkit` está nas dependências raiz

### Erro: "Database connection failed"
- Verifique se as variáveis de ambiente estão configuradas no Vercel
- Teste a connection string localmente

### Erro: "Token inválido"
- Verifique se o `JWT_SECRET` está configurado no Vercel
- Limpe o localStorage e faça login novamente

---

## 📊 Monitoramento

Após o deploy, monitore:

1. **Logs:** Vercel Dashboard > Deployments > Logs
2. **Analytics:** Vercel Dashboard > Analytics
3. **Errors:** Vercel Dashboard > Errors

---

## 🎉 Pronto!

Seu sistema está no ar! 🚀

**URL:** https://seu-projeto.vercel.app

**Custo:** R$ 0 (free tier Vercel + Neon)
