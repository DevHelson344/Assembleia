# Deploy no Vercel com Neon

## Pré-requisitos

- Conta no GitHub (projeto já está lá)
- Conta no Vercel (gratuita)
- Conta no Neon (gratuita)

## 1. Preparar Banco de Dados no Neon

### 1.1 Criar/Verificar Projeto no Neon
1. Acesse: https://neon.tech
2. Seu projeto já existe com a connection string:
   ```
   postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

### 1.2 Verificar Tabelas
As tabelas já devem estar criadas. Para confirmar, acesse o SQL Editor no Neon e execute:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

Se precisar recriar, execute o conteúdo de `database/schema.sql`

### 1.3 Verificar Usuários
Execute no SQL Editor:
```sql
SELECT username, role FROM users;
```

Você deve ter:
- `admin` (role: admin) - Acesso total
- `pastorA` (role: pastor) - Igreja A
- `pastorB` (role: pastor) - Igreja B

## 2. Deploy no Vercel

### Opção A: Via Dashboard (Recomendado)

1. **Acessar Vercel**
   - Vá para: https://vercel.com
   - Faça login com GitHub

2. **Importar Projeto**
   - Clique em "Add New Project"
   - Selecione o repositório: `DevHelson344/Assembleia`
   - Clique em "Import"

3. **Configurar Variáveis de Ambiente**
   Adicione estas variáveis:
   
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_szbhAUgW8e4u@ep-sparkling-cherry-aha0yvjj-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   JWT_SECRET=igreja-sistema-secreto-2024-producao-vercel
   
   NODE_ENV=production
   ```

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - Pronto! 🎉

### Opção B: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Adicionar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NODE_ENV

# Deploy em produção
vercel --prod
```

## 3. Configurações Importantes

### 3.1 Build Settings (já configurado no vercel.json)
- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `frontend/dist`

### 3.2 Root Directory
- Deixe em branco (raiz do projeto)

## 4. Testar Deploy

Após o deploy, você receberá uma URL tipo:
```
https://assembleia-xxx.vercel.app
```

### 4.1 Testar API
```
https://assembleia-xxx.vercel.app/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-01-22T..."
}
```

### 4.2 Testar Login
Acesse a URL e faça login com:

**Super Admin:**
- Username: `admin`
- Senha: `admin123`

**Pastor A:**
- Username: `pastorA`
- Senha: `senha123`

**Pastor B:**
- Username: `pastorB`
- Senha: `senha123`

## 5. Domínio Personalizado (Opcional)

1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

## 6. Monitoramento

### Logs
- Acesse o dashboard do Vercel
- Vá em "Deployments"
- Clique no deployment
- Veja "Functions" para logs da API

### Banco de Dados
- Acesse Neon dashboard
- Veja "Monitoring" para uso do banco

## 7. Troubleshooting

### Erro 500 na API
- Verifique as variáveis de ambiente
- Confira os logs no Vercel
- Teste a connection string do Neon

### Página em branco
- Verifique se o build do frontend foi bem-sucedido
- Confira o caminho do `distDir` no vercel.json

### Erro de CORS
- Já configurado no backend
- Se persistir, adicione domínio específico no cors()

## 8. Custos

**Neon Free Tier:**
- 0.5 GB storage
- 3 projetos
- Suficiente para começar

**Vercel Free Tier:**
- 100 GB bandwidth
- Domínio .vercel.app
- Serverless functions

**Total: R$ 0** 🎉

## 9. Próximos Passos

Após deploy bem-sucedido:

1. ✅ Trocar senhas padrão
2. ✅ Configurar domínio personalizado
3. ✅ Criar backup do banco
4. ✅ Monitorar uso e performance
5. ✅ Adicionar mais igrejas conforme necessário

## 10. Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs

# Listar deployments
vercel ls

# Remover deployment
vercel rm <deployment-url>

# Ver variáveis de ambiente
vercel env ls
```
