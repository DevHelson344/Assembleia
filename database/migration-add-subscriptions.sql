-- Migration: Sistema de Assinaturas

-- Planos de assinatura
CREATE TABLE subscription_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  interval VARCHAR(20) NOT NULL CHECK (interval IN ('monthly', 'yearly')),
  features JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assinaturas das igrejas
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
  plan_id INTEGER REFERENCES subscription_plans(id),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP NOT NULL,
  current_period_end TIMESTAMP NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  payment_method VARCHAR(50),
  external_subscription_id VARCHAR(255), -- ID do gateway de pagamento
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Histórico de pagamentos
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  subscription_id INTEGER REFERENCES subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_date TIMESTAMP,
  payment_method VARCHAR(50),
  external_payment_id VARCHAR(255), -- ID do gateway de pagamento
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir plano padrão de R$ 30/mês
INSERT INTO subscription_plans (name, price, interval, features) VALUES 
('Plano Mensal', 30.00, 'monthly', '{"max_members": 500, "reports": true, "support": "email"}');

-- Índices
CREATE INDEX idx_subscriptions_church ON subscriptions(church_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
