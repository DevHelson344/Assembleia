# Sistema Multi-Igreja

O sistema agora suporta múltiplas igrejas isoladas. Cada usuário vê apenas os dados da sua igreja.

## Como Funciona

- Cada igreja tem seus próprios membros, finanças e eventos
- Usuários são vinculados a uma igreja específica
- Dados são completamente isolados entre igrejas
- Pastor A só vê dados da Igreja A
- Pastor B só vê dados da Igreja B

## Estrutura

```
churches (igrejas)
  ├── users (usuários da igreja)
  ├── members (membros da igreja)
  ├── monthly_cash (caixa mensal da igreja)
  └── events (eventos da igreja)
```

## Criar Nova Igreja

```bash
cd backend
node create-church.js "Nome da Igreja" "Endereço"
```

## Criar Usuário para uma Igreja

```bash
cd backend

# Listar igrejas disponíveis
node create-admin.js

# Criar usuário para igreja específica
node create-admin.js <username> <password> <role> <church_id>

# Exemplo:
node create-admin.js pastorA senha123 pastor 1
node create-admin.js pastorB senha123 pastor 2
```

## Criar Super Admin (acesso total)

```bash
cd backend

# Criar admin que vê todas as igrejas
node create-super-admin.js admin admin123
```

## Usuários de Teste Criados

**Super Admin (vê todas as igrejas):**
- Username: `admin`
- Senha: `admin123`
- Perfil: Administrador
- Acesso: TODAS as igrejas

**Igreja A:**
- Username: `pastorA`
- Senha: `senha123`
- Igreja: Igreja Assembleia A

**Igreja B:**
- Username: `pastorB`
- Senha: `senha123`
- Igreja: Igreja Assembleia B

## Testando

1. Faça login com `pastorA` / `senha123`
2. Cadastre alguns membros
3. Faça logout
4. Faça login com `pastorB` / `senha123`
5. Cadastre outros membros
6. Verifique que cada pastor vê apenas seus próprios membros!

## Segurança

- Todos os dados são filtrados por `church_id`
- Impossível acessar dados de outra igreja
- Token JWT inclui o `church_id` do usuário
- Queries no banco sempre incluem filtro por igreja


## Hierarquia de Acesso

**Admin (Administrador):**
- Vê TODAS as igrejas
- Acesso total ao sistema
- Não vinculado a nenhuma igreja específica
- Ideal para gerenciar múltiplas igrejas

**Pastor:**
- Vê apenas sua igreja
- Acesso total aos dados da igreja
- Pode gerenciar membros, financeiro e relatórios

**Tesoureiro:**
- Vê apenas sua igreja
- Acesso apenas ao financeiro e relatórios

**Secretário:**
- Vê apenas sua igreja
- Acesso apenas aos membros e relatórios
