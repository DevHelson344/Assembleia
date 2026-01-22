import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';
import { pool } from './db';
import { authenticate, authorize, AuthRequest } from './auth';

// Auth Router
export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT u.*, c.name as church_name FROM users u LEFT JOIN churches c ON u.church_id = c.id WHERE u.username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, church_id: user.church_id },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    res.json({ 
      token, 
      role: user.role, 
      username: user.username, 
      church_id: user.church_id,
      church_name: user.church_name || 'Sistema'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Members Router
export const membersRouter = Router();

membersRouter.use(authenticate);

membersRouter.get('/', async (req: AuthRequest, res) => {
  try {
    const query = req.user!.role === 'admin' 
      ? 'SELECT * FROM members ORDER BY name'
      : 'SELECT * FROM members WHERE church_id = $1 ORDER BY name';
    
    const params = req.user!.role === 'admin' ? [] : [req.user!.church_id];
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar membros' });
  }
});

membersRouter.post('/', authorize('pastor', 'secretario'), async (req: AuthRequest, res) => {
  const { name, family, baptism_date, status, department } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO members (name, family, baptism_date, status, department, church_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, family, baptism_date, status, department, req.user!.church_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar membro' });
  }
});

membersRouter.put('/:id', authorize('pastor', 'secretario'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { name, family, baptism_date, status, department } = req.body;

  try {
    const result = await pool.query(
      'UPDATE members SET name = $1, family = $2, baptism_date = $3, status = $4, department = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 AND church_id = $7 RETURNING *',
      [name, family, baptism_date, status, department, id, req.user!.church_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
});

// Financial Router
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

// Reports Router
export const reportsRouter = Router();

reportsRouter.get('/financial/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const token = req.query.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const cashResult = await pool.query(
      'SELECT * FROM monthly_cash WHERE year = $1 AND month = $2',
      [year, month]
    );

    if (cashResult.rows.length === 0) {
      const newCash = await pool.query(
        'INSERT INTO monthly_cash (year, month) VALUES ($1, $2) RETURNING *',
        [year, month]
      );
      
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-${year}-${month}.pdf`);
      doc.pipe(res);
      
      doc.fontSize(20).text('Relatório Financeiro', { align: 'center' });
      doc.fontSize(14).text(`Mês: ${month}/${year}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text('Nenhuma transação registrada neste período.');
      doc.end();
      return;
    }

    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE monthly_cash_id = $1 ORDER BY transaction_date',
      [cashResult.rows[0].id]
    );

    const entradas = transactions.rows
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const saidas = transactions.rows
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-${year}-${month}.pdf`);

    doc.pipe(res);

    doc.fontSize(24).text('Relatório Financeiro', { align: 'center' });
    doc.fontSize(16).text(`Período: ${month}/${year}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).text('RESUMO FINANCEIRO', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total de Entradas: R$ ${entradas.toFixed(2)}`);
    doc.text(`Total de Saídas: R$ ${saidas.toFixed(2)}`);
    doc.fontSize(14).text(`Saldo Final: R$ ${(entradas - saidas).toFixed(2)}`);
    doc.moveDown(2);

    if (transactions.rows.length > 0) {
      doc.fontSize(14).text('TRANSAÇÕES DETALHADAS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      
      transactions.rows.forEach((t, index) => {
        const date = new Date(t.transaction_date).toLocaleDateString('pt-BR');
        const typeLabel = t.type === 'entrada' ? 'ENTRADA' : 'SAÍDA';
        doc.text(`${index + 1}. ${date} | ${typeLabel} | ${t.category} | R$ ${parseFloat(t.amount).toFixed(2)}`);
        if (t.description) {
          doc.fontSize(9).text(`   ${t.description}`);
          doc.fontSize(10);
        }
        doc.moveDown(0.3);
      });
    } else {
      doc.fontSize(12).text('Nenhuma transação registrada neste período.');
    }

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});
