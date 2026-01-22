import { Router } from 'express';
import { pool } from '../db';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const financialRouter = Router();

financialRouter.use(authenticate);
financialRouter.use(authorize('pastor', 'tesoureiro'));

financialRouter.get('/monthly/:year/:month', async (req, res) => {
  const { year, month } = req.params;

  try {
    let cashResult = await pool.query(
      'SELECT * FROM monthly_cash WHERE year = $1 AND month = $2',
      [year, month]
    );

    if (cashResult.rows.length === 0) {
      const newCash = await pool.query(
        'INSERT INTO monthly_cash (year, month) VALUES ($1, $2) RETURNING *',
        [year, month]
      );
      cashResult = newCash;
    }

    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE monthly_cash_id = $1 ORDER BY transaction_date DESC',
      [cashResult.rows[0].id]
    );

    res.json({
      cash: cashResult.rows[0],
      transactions: transactions.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados financeiros' });
  }
});

financialRouter.post('/transaction', async (req: AuthRequest, res) => {
  const { monthly_cash_id, type, category, amount, description, transaction_date } = req.body;

  try {
    const cashCheck = await pool.query(
      'SELECT is_closed FROM monthly_cash WHERE id = $1',
      [monthly_cash_id]
    );

    if (cashCheck.rows[0]?.is_closed) {
      return res.status(400).json({ error: 'Caixa fechado. Não é possível adicionar transações.' });
    }

    const result = await pool.query(
      'INSERT INTO transactions (monthly_cash_id, type, category, amount, description, transaction_date, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [monthly_cash_id, type, category, amount, description, transaction_date, req.user!.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

financialRouter.post('/close-month', authorize('pastor', 'tesoureiro'), async (req: AuthRequest, res) => {
  const { monthly_cash_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE monthly_cash SET is_closed = TRUE, closed_at = CURRENT_TIMESTAMP, closed_by = $1 WHERE id = $2 RETURNING *',
      [req.user!.id, monthly_cash_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fechar caixa' });
  }
});
