# 🚀 Instruções de Deploy - Vercel (ATUALIZADO)

## ✅ Correções Aplicadas

1. ✅ Variáveis de ambiente corrigidas
2. ✅ `vercel.json` simplificado e corrigido
3. ✅ Script de build adicionado no package.json raiz
4. ✅ Build testado e funcionando

---

## 📋 Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Banco Neon já configurado
- Git instalado

---

## 🎯 Deploy Rápido

### 1. Commit e Push

```bash
git add .
git commit -m "fix: corrigir configuração do Vercel"
git push origin main
```

### 2. No Vercel Dashboard

1. Vá em **Settings > Environment Variables**
2. Adicione as variáveis:

```
DATABASE_URL = postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET = 6a4d2b240400a62c1b5bec652530247f51a890f3c2d6a22a426c3c8736ddeb8627be85159874a6fb5513e4e48e00a9b3bd4ed113678d800711dcc9ed6ca0213d

NODE_ENV = production
```

3. Vá em **Deployments** e clique em **Redeploy**

---

## ✅ O que foi corrigido

### vercel.json (simplificado)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "framework": null,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### package.json (raiz)
Adicionado script de build:
```json
"scripts": {
  "build": "cd frontend && npm install && npm run build"
}
```

---

## 🧪 Testar Após Deploy

1. **Homepage:** `https://seu-projeto.vercel.app`
   - Deve carregar a tela de login

2. **API:** `https://seu-projeto.vercel.app/api/health`
   - Deve retornar: `{"status":"ok","timestamp":"..."}`

3. **Login:**
   - Usuário: `pastor`
   - Senha: `admin123`

---

## 🆘 Se ainda der erro 404

Execute no terminal local:
```bash
vercel --prod
```

Isso vai fazer o deploy direto via CLI e você pode ver os logs em tempo real.

---

## 📊 Estrutura Final

```
Projeto
├── frontend/dist/        → Arquivos estáticos (HTML, CSS, JS)
├── api/index.ts          → Serverless Function (API)
└── vercel.json           → Configuração do deploy
```

---

## 🎉 Pronto!

Após o redeploy, seu sistema estará funcionando! 🚀
