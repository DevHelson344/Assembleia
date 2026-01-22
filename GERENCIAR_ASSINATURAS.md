# Como Gerenciar Assinaturas - R$ 30/mês

## 🎯 Processo de Venda

1. Cliente acessa **/** (landing page)
2. Preenche formulário com dados da igreja
3. Recebe código PIX de R$ 30,00
4. Envia comprovante via WhatsApp

## ✅ Ativação Manual (após receber pagamento)

### Passo 1: Criar a Igreja
```bash
cd backend
npm run create-church "Igreja Batista Central" "Rua X, 123" "(11) 99999-9999"
```

Anote o **ID** retornado (ex: 5)

### Passo 2: Criar Usuário Admin
```bash
npm run create-admin admin@igrejabatista senha123 5
```

Substitua:
- `admin@igrejabatista` = username
- `senha123` = senha inicial
- `5` = ID da igreja do passo 1

### Passo 3: Enviar E-mail com Credenciais

**Assunto:** ✅ Sua conta ChurchManager está ativa!

```
Olá [Nome do Responsável],

Pagamento confirmado! Bem-vindo ao ChurchManager 🎉

🔐 SEUS DADOS DE ACESSO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL: https://seudominio.com/login
Usuário: admin@igrejabatista
Senha: senha123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMPORTANTE: Troque sua senha no primeiro acesso!

📱 Suporte WhatsApp: (11) 99999-9999
📧 E-mail: contato@seudominio.com

Qualquer dúvida, estamos à disposição!

Equipe ChurchManager
```

## 📊 Controle de Pagamentos

Crie uma planilha Google Sheets:

| Data Pgto | Igreja | Responsável | E-mail | WhatsApp | Status | Vencimento |
|-----------|--------|-------------|--------|----------|--------|------------|
| 22/01/26 | Igreja X | João Silva | joao@email.com | (11) 99999-9999 | ✅ Ativo | 22/02/26 |
| 20/01/26 | Igreja Y | Maria | maria@email.com | (11) 88888-8888 | ✅ Ativo | 20/02/26 |

## 🔄 Renovação Mensal

**5 dias antes do vencimento:**
```
Olá [Nome]! 👋

Lembrete: sua assinatura do ChurchManager vence em 5 dias (dia XX/XX).

Valor: R$ 30,00
PIX: [código copia e cola]

Após o pagamento, envie o comprovante aqui mesmo!
```

**No dia do vencimento:**
```
Olá [Nome]! 

Sua assinatura vence hoje. Para continuar usando:

💰 R$ 30,00 via PIX
📋 [código copia e cola]

Envie o comprovante para renovar automaticamente!
```

**3 dias após vencimento (opcional):**
```
Olá [Nome],

Notamos que sua assinatura está vencida há 3 dias.

Para reativar o acesso, basta fazer o pagamento:
💰 R$ 30,00 via PIX
📋 [código copia e cola]

Estamos à disposição para ajudar!
```

## ⚙️ Configurações Importantes

### Atualizar Código PIX na Landing Page

Edite: `frontend/src/pages/Landing.tsx`

Procure por:
```typescript
00020126580014br.gov.bcb.pix0136sua-chave-pix-aqui@email.com...
```

Substitua pelo seu código PIX real.

### Atualizar WhatsApp

Na mesma página, procure:
```typescript
https://wa.me/5511999999999
```

Substitua pelo seu número (formato: 55 + DDD + número)

## 🚫 Desativar Igreja (não pagou)

Se decidir bloquear acesso:

```sql
-- Desabilitar todos os usuários da igreja
UPDATE users SET role = 'inactive' WHERE church_id = 5;
```

Para reativar:
```sql
UPDATE users SET role = 'admin' WHERE church_id = 5 AND username = 'admin@igreja';
```

## 💡 Dicas

✅ Responda rápido no WhatsApp (experiência do cliente)
✅ Mantenha backup do banco de dados
✅ Use a planilha para controlar vencimentos
✅ Envie lembretes automáticos (pode usar ferramentas como Zapier)
✅ Seja educado mesmo com inadimplentes

## 📈 Escalando

Quando tiver muitos clientes:

1. **Automatize lembretes** com ferramentas como:
   - Zapier + Google Sheets + WhatsApp Business API
   - N8N (self-hosted)

2. **Sistema de cobrança automática** (futuro):
   - Integrar API do Mercado Pago
   - Assinaturas recorrentes automáticas

3. **Painel admin** (futuro):
   - Criar página para gerenciar igrejas
   - Ver status de pagamentos
   - Ativar/desativar contas
