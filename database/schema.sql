-- Schema para Sistema de Gestão de Igrejas

-- Igrejas (multi-tenant)
CREATE TABLE churches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuários do sistema
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'pastor', 'tesoureiro', 'secretario')),
  church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membros da igreja
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  family VARCHAR(100),
  baptism_date DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('ativo', 'afastado', 'visitante')),
  department VARCHAR(20) CHECK (department IN ('criancas', 'jovens', 'senhoras', 'obreiros', 'homens')),
  church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de membros (imutável)
CREATE TABLE member_history (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id),
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('entrada', 'saida', 'falecimento', 'batismo')),
  event_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Caixa mensal (fechado após o mês)
CREATE TABLE monthly_cash (
  id SERIAL PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  is_closed BOOLEAN DEFAULT FALSE,
  closed_at TIMESTAMP,
  closed_by INTEGER REFERENCES users(id),
  church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
  UNIQUE(month, year, church_id)
);

-- Transações financeiras
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  monthly_cash_id INTEGER REFERENCES monthly_cash(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('entrada', 'saida')),
  category VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  transaction_date DATE NOT NULL,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eventos
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(30) NOT NULL,
  event_date DATE NOT NULL,
  church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Presença em eventos
CREATE TABLE event_attendance (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  member_id INTEGER REFERENCES members(id),
  present BOOLEAN DEFAULT TRUE,
  UNIQUE(event_id, member_id)
);

-- Índices para performance
CREATE INDEX idx_users_church ON users(church_id);
CREATE INDEX idx_members_church ON members(church_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_department ON members(department);
CREATE INDEX idx_monthly_cash_church ON monthly_cash(church_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_monthly ON transactions(monthly_cash_id);
CREATE INDEX idx_events_church ON events(church_id);
CREATE INDEX idx_events_date ON events(event_date);
