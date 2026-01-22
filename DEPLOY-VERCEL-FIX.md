# 🔧 Resolver Erro de Clone no Vercel

## Problema
```
There was a permanent problem cloning the repo.
```

## Soluções (tente nesta ordem)

### ✅ Solução 1: Reconectar GitHub no Vercel

1. **Desconectar GitHub:**
   - Vá para: https://vercel.com/account
   - Clique em "Connected Git Accounts"
   - Clique em "Disconnect" no GitHub

2. **Reconectar GitHub:**
   - Clique em "Connect Git Provider"
   - Selecione GitHub
   - Autorize o Vercel novamente
   - Dê permissão para acessar o repositório `Assembleia`

3. **Importar novamente:**
   - Vá para: https://vercel.com/new
   - Selecione `DevHelson344/Assembleia`
   - Configure as variáveis de ambiente
   - Deploy

---

### ✅ Solução 2: Tornar Repositório Público (Temporário)

1. **No GitHub:**
   - Vá para: https://github.com/DevHelson344/Assembleia
   - Clique em "Settings"
   - Role até "Danger Zone"
   - Clique em "Change visibility"
   - Selecione "Make public"
   - Confirme

2. **No Vercel:**
   - Tente importar novamente
   - Após deploy bem-sucedido, pode tornar privado novamente

---

### ✅ Solução 3: Deploy Direto pelo Neon (Alternativa)

O Neon tem integração direta com Vercel! Mais fácil:

1. **Acesse Neon:**
   - Vá para: https://console.neon.tech
   - Selecione seu projeto

2. **Deploy via Neon:**
   - Clique em "Deploy"
   - Selecione "Vercel"
   - Autorize a conexão
   - O Neon configura tudo automaticamente!

---

### ✅ Solução 4: Deploy via CLI do Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (na pasta do projeto)
vercel

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
# Cole: postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

vercel env add JWT_SECRET
# Cole: igreja-sistema-secreto-2024-producao-vercel

vercel env add NODE_ENV
# Cole: production

# Deploy em produção
vercel --prod
```

---

### ✅ Solução 5: Criar Novo Repositório

Se nada funcionar, vamos criar um repositório novo:

```bash
# Criar novo repo no GitHub (via web)
# Nome: igreja-sistema

# Adicionar novo remote
git remote add vercel https://github.com/DevHelson344/igreja-sistema.git

# Push
git push vercel main

# Importar no Vercel usando o novo repo
```

---

## 🎯 Recomendação

**Tente primeiro a Solução 1** (reconectar GitHub). É o mais comum e resolve 90% dos casos.

Se não funcionar, **tente a Solução 3** (deploy via Neon) - é super fácil e automático!

---

## 📋 Variáveis de Ambiente (para qualquer solução)

```env
DATABASE_URL=postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET=igreja-sistema-secreto-2024-producao-vercel

NODE_ENV=production
```

---

## 🆘 Ainda com Problema?

**Verifique:**
- [ ] Repositório existe no GitHub?
- [ ] Você é o dono do repositório?
- [ ] Vercel tem permissão para acessar?
- [ ] Repositório não está vazio?
- [ ] Branch main existe?

**Teste o repositório:**
```bash
# Ver se está tudo ok
git remote -v
git status
git log --oneline -3

# Forçar push (se necessário)
git push -f origin main
```

---

## ✅ Após Deploy Funcionar

1. Acesse a URL do Vercel
2. Teste o login:
   - **Admin:** `admin` / `admin123`
   - **Pastor A:** `pastorA` / `senha123`
   - **Pastor B:** `pastorB` / `senha123`

3. Verifique:
   - [ ] Dashboard carrega
   - [ ] Membros aparecem
   - [ ] Cada pastor vê só sua igreja
   - [ ] Admin vê todas as igrejas

---

## 💡 Dica

Se o deploy via dashboard não funcionar, **use a CLI do Vercel** (Solução 4). É mais confiável e você vê os erros em tempo real!
