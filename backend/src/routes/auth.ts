import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

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
