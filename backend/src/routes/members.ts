import { Router } from 'express';
import { pool } from '../db';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

export const membersRouter = Router();

membersRouter.use(authenticate);

membersRouter.get('/', async (req: AuthRequest, res) => {
  try {
    // Admin vê todos os membros, outros usuários veem apenas da sua igreja
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

membersRouter.get('/stats', async (req: AuthRequest, res) => {
  try {
    const churchFilter = req.user!.role === 'admin' ? '' : 'AND church_id = $1';
    const params = req.user!.role === 'admin' ? [] : [req.user!.church_id];
    
    const totalResult = await pool.query(
      `SELECT COUNT(*) as total FROM members WHERE status = 'ativo' ${churchFilter}`,
      params
    );
    
    const departmentResult = await pool.query(`
      SELECT 
        department,
        COUNT(*) as count
      FROM members 
      WHERE status = 'ativo' AND department IS NOT NULL ${churchFilter}
      GROUP BY department
    `, params);
    
    const statusResult = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM members 
      WHERE 1=1 ${churchFilter}
      GROUP BY status
    `, params);

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
