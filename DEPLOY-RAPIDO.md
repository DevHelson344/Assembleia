# 🚀 Deploy Rápido no Vercel

## Passo a Passo (5 minutos)

### 1️⃣ Acessar Vercel
- Vá para: https://vercel.com
- Faça login com GitHub

### 2️⃣ Importar Projeto
- Clique em **"Add New Project"**
- Selecione: **DevHelson344/Assembleia**
- Clique em **"Import"**

### 3️⃣ Configurar Variáveis de Ambiente

Clique em **"Environment Variables"** e adicione:

**DATABASE_URL:**
```
postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**JWT_SECRET:**
```
igreja-sistema-secreto-2024-producao-vercel
```

**NODE_ENV:**
```
production
```

### 4️⃣ Deploy
- Clique em **"Deploy"**
- Aguarde 2-3 minutos ⏳
- Pronto! 🎉

### 5️⃣ Testar

Você receberá uma URL tipo:
```
https://assembleia-xxx.vercel.app
```

**Logins disponíveis:**

🔑 **Super Admin (vê todas as igrejas):**
- Username: `admin`
- Senha: `admin123`

🔑 **Pastor A (Igreja Assembleia A):**
- Username: `pastorA`
- Senha: `senha123`

🔑 **Pastor B (Igreja Assembleia B):**
- Username: `pastorB`
- Senha: `senha123`

---

## ✅ Checklist Pós-Deploy

- [ ] Testar login com admin
- [ ] Testar login com pastorA
- [ ] Testar login com pastorB
- [ ] Verificar que cada pastor vê apenas sua igreja
- [ ] Verificar que admin vê todas as igrejas
- [ ] Trocar senhas padrão
- [ ] Configurar domínio personalizado (opcional)

---

## 🆘 Problemas?

**Erro 500:**
- Verifique as variáveis de ambiente
- Confira se copiou a DATABASE_URL completa

**Página em branco:**
- Aguarde o build completar
- Recarregue a página (Ctrl+F5)

**Login não funciona:**
- Verifique se o JWT_SECRET foi configurado
- Confira os logs no dashboard do Vercel

---

## 📊 Monitoramento

**Ver logs:**
1. Dashboard do Vercel
2. Clique no deployment
3. Vá em "Functions"

**Banco de dados:**
- Acesse: https://neon.tech
- Veja "Monitoring"

---

## 💰 Custos

**Tudo GRÁTIS!** 🎉
- Neon: Free tier (0.5GB)
- Vercel: Free tier (100GB bandwidth)

---

## 🎯 Próximos Passos

1. Adicionar mais igrejas
2. Criar mais usuários
3. Configurar domínio próprio
4. Fazer backup do banco

**Documentação completa:** Ver `DEPLOY.md`
