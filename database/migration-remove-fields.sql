-- Migration: Remover campos family e baptism_date da tabela members

-- Remove as colunas
ALTER TABLE members DROP COLUMN IF EXISTS family;
ALTER TABLE members DROP COLUMN IF EXISTS baptism_date;

-- Adicionar tabela para histórico de crescimento mensal (snapshot)
CREATE TABLE IF NOT EXISTS growth_snapshots (
  id SERIAL PRIMARY KEY,
  church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
  department VARCHAR(20) CHECK (department IN ('criancas', 'jovens', 'senhoras', 'obreiros', 'homens', 'geral')),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  total_members INTEGER NOT NULL DEFAULT 0,
  active_members INTEGER NOT NULL DEFAULT 0,
  new_members INTEGER NOT NULL DEFAULT 0,
  left_members INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(church_id, department, month, year)
);

CREATE INDEX idx_growth_church ON growth_snapshots(church_id);
CREATE INDEX idx_growth_date ON growth_snapshots(year, month);
CREATE INDEX idx_growth_department ON growth_snapshots(department);

COMMENT ON TABLE growth_snapshots IS 'Snapshot mensal do crescimento por departamento e geral';
