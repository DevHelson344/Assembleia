# Atualização de Segurança - HttpOnly Cookies

## O que mudou?

O sistema foi atualizado para usar **HttpOnly Cookies** em vez de localStorage para armazenar o token JWT de autenticação.

## Por que essa mudança?

### Vulnerabilidades do localStorage:
- ❌ Acessível via JavaScript (vulnerável a XSS)
- ❌ Qualquer script malicioso pode ler o token
- ❌ Não expira automaticamente

### Vantagens dos HttpOnly Cookies:
- ✅ **Não acessível via JavaScript** - proteção contra XSS
- ✅ **Enviado automaticamente** pelo navegador
- ✅ **Secure flag** em produção (HTTPS only)
- ✅ **SameSite=strict** - proteção contra CSRF
- ✅ **Expira automaticamente** após 8 horas

## O que foi implementado?

### Backend:
1. Adicionado `cookie-parser` middleware
2. Token JWT agora é enviado via cookie HttpOnly
3. Middleware de autenticação aceita token do cookie ou header (compatibilidade)
4. Nova rota `/api/auth/me` para verificar autenticação
5. Nova rota `/api/auth/logout` para limpar o cookie

### Frontend:
1. Axios configurado com `withCredentials: true` (envia cookies automaticamente)
2. Removido armazenamento do token no localStorage
3. Apenas dados não sensíveis ficam no localStorage (role, username, church_name)
4. Verificação de autenticação via API ao carregar a aplicação
5. Todas as requisições agora usam cookies automaticamente

## Como instalar?

```bash
# Instalar as novas dependências
npm install

# Ou no backend
cd backend
npm install
```

## Configuração de Produção

No ambiente de produção, certifique-se de:

1. Usar HTTPS (obrigatório para cookies secure)
2. Configurar o CORS corretamente:
```javascript
app.use(cors({
  origin: 'https://seu-dominio.com', // Especifique o domínio exato
  credentials: true
}));
```

3. Variável de ambiente `NODE_ENV=production`

## Compatibilidade

O sistema mantém compatibilidade com o método antigo (Authorization header) durante a transição, mas recomenda-se usar apenas cookies.

## Dados no localStorage

Agora apenas informações não sensíveis ficam no localStorage:
- `role` - papel do usuário (pastor, secretario, etc)
- `username` - nome do usuário
- `church_name` - nome da igreja

O **token JWT** nunca mais fica no localStorage! 🔒
