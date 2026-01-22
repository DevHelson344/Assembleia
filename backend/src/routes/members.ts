import { Router } from 'express';
import { pool } from '../db';
import { authenticate, authorize } from '../middleware/auth';

export const membersRouter = Router();

membersRouter.use(authenticate);

membersRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM members ORDER BY name'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar membros' });
  }
});

membersRouter.get('/stats', async (req, res) => {
  try {
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM members WHERE status = $1', ['ativo']);
    
    const departmentResult = await pool.query(`
      SELECT 
        department,
        COUNT(*) as count
      FROM members 
      WHERE status = 'ativo' AND department IS NOT NULL
      GROUP BY department
    `);
    
    const statusResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM members 
      GROUP BY status
    `);

    const stats = {
      total: parseInt(totalResult.rows[0].total),
      byDepartment: departmentResult.rows.reduce((acc, row) => {
        acc[row.department] = parseInt(row.count);
        return acc;
      }, {} as Record<string, number>),
      byStatus: statusResult.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {} as Record<string, number>)
    };

    res.json(stats);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

membersRouter.post('/', authorize('pastor', 'secretario'), async (req, res) => {
  const { name, family, baptism_date, status, department } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO members (name, family, baptism_date, status, department) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, family, baptism_date, status, department]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar membro' });
  }
});

membersRouter.put('/:id', authorize('pastor', 'secretario'), async (req, res) => {
  const { id } = req.params;
  const { name, family, baptism_date, status, department } = req.body;

  try {
    const result = await pool.query(
      'UPDATE members SET name = $1, family = $2, baptism_date = $3, status = $4, department = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, family, baptism_date, status, department, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar membro' });
  }
});
