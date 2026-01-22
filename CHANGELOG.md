# Changelog - Atualizações do Sistema

## Versão 2.0 - Melhorias de Segurança e Nova Funcionalidade

### 🔒 Segurança Aprimorada
- **HttpOnly Cookies**: Token JWT agora é armazenado em cookies HttpOnly (não acessível via JavaScript)
- **Proteção contra XSS**: Token não pode mais ser roubado por scripts maliciosos
- **Proteção contra CSRF**: Implementado `sameSite: 'strict'` nos cookies
- **Expiração automática**: Cookies expiram após 8 horas
- **HTTPS em produção**: Flag `secure` ativada automaticamente em produção

### 📊 Nova Funcionalidade: Tela de Crescimento
- **Visualização de crescimento**: Gráfico de linha mostrando evolução de membros ativos
- **Análise por departamento**: Gráficos de barras e tabela histórica por departamento
- **Métricas importantes**:
  - Total de membros
  - Membros ativos
  - Novos membros no mês
  - Taxa de crescimento percentual
- **Períodos configuráveis**: 3, 6 ou 12 meses
- **Histórico mensal**: Tabela detalhada com evolução de cada departamento

### 🗑️ Campos Removidos
- **Família**: Campo removido da tabela de membros
- **Data de Batismo**: Campo removido da tabela de membros
- Formulário de membros simplificado (apenas Nome, Departamento e Situação)

### 🔧 Melhorias Técnicas

#### Backend:
- Nova rota: `GET /api/members/growth/:months` - Retorna dados de crescimento
- Nova rota: `GET /api/auth/me` - Verifica autenticação
- Nova rota: `POST /api/auth/logout` - Limpa cookie de autenticação
- Middleware atualizado para aceitar token de cookie ou header
- Adicionado `cookie-parser` como dependência

#### Frontend:
- Nova página: `/growth` - Tela de crescimento da igreja
- Axios configurado com `withCredentials: true` globalmente
- Remoção de todos os usos de `localStorage.getItem('token')`
- Apenas dados não sensíveis no localStorage (role, username, church_name)
- Verificação de autenticação via API ao carregar

#### Database:
- Migration criada: `database/migration-remove-fields.sql`
- Remove colunas `family` e `baptism_date` da tabela `members`
- Nova tabela: `growth_snapshots` (preparada para futuras otimizações)

### 📋 Rotas Atualizadas

**Autenticação:**
- `POST /api/auth/login` - Agora retorna cookie HttpOnly
- `POST /api/auth/logout` - Nova rota para logout
- `GET /api/auth/me` - Nova rota para verificar autenticação

**Membros:**
- `GET /api/members` - Inalterado
- `POST /api/members` - Campos `family` e `baptism_date` removidos
- `PUT /api/members/:id` - Campos `family` e `baptism_date` removidos
- `GET /api/members/growth/:months` - Nova rota para dados de crescimento

### 🚀 Como Aplicar as Mudanças

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar migration do banco de dados:**
```bash
psql -U seu_usuario -d seu_banco -f database/migration-remove-fields.sql
```

3. **Reiniciar o servidor:**
```bash
npm run dev
```

### ⚠️ Breaking Changes

- **localStorage**: O token não está mais disponível no localStorage
- **API de membros**: Campos `family` e `baptism_date` não são mais aceitos/retornados
- **Cookies**: Navegador precisa suportar cookies (todos os navegadores modernos suportam)

### 🎯 Próximos Passos Recomendados

1. Configurar HTTPS em produção (obrigatório para cookies secure)
2. Configurar CORS com domínio específico em produção
3. Implementar refresh tokens para sessões mais longas
4. Adicionar rate limiting nas rotas de autenticação
5. Implementar logs de auditoria para ações sensíveis

### 📝 Notas

- A aplicação mantém compatibilidade temporária com Authorization header
- Recomenda-se usar apenas cookies em novas implementações
- Todos os usuários precisarão fazer login novamente após a atualização
