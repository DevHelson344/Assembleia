-- Adicionar tabela de igrejas
CREATE TABLE IF NOT EXISTS churches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar coluna church_id nas tabelas existentes
ALTER TABLE users ADD COLUMN IF NOT EXISTS church_id INTEGER REFERENCES churches(id);
ALTER TABLE members ADD COLUMN IF NOT EXISTS church_id INTEGER REFERENCES members(id);
ALTER TABLE monthly_cash ADD COLUMN IF NOT EXISTS church_id INTEGER REFERENCES churches(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS church_id INTEGER REFERENCES churches(id);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_users_church ON users(church_id);
CREATE INDEX IF NOT EXISTS idx_members_church ON members(church_id);
CREATE INDEX IF NOT EXISTS idx_monthly_cash_church ON monthly_cash(church_id);
CREATE INDEX IF NOT EXISTS idx_events_church ON events(church_id);

-- Inserir igrejas de exemplo
INSERT INTO churches (name, address) VALUES 
  ('Igreja Assembleia A', 'Endereço da Igreja A'),
  ('Igreja Assembleia B', 'Endereço da Igreja B')
ON CONFLICT DO NOTHING;
