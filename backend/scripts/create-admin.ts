import bcrypt from 'bcrypt';
import { pool } from '../src/db';
import dotenv from 'dotenv';
import { join } from 'path';

// Carregar .env do diretório backend
dotenv.config({ path: join(__dirname, '../.env') });

async function createAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';
  const role = process.argv[4] || 'pastor';

  try {
    console.log('🔄 Conectando ao Neon...');
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, passwordHash, role]
    );

    console.log('✓ Usuário criado com sucesso!');
    console.log('Username:', result.rows[0].username);
    console.log('Senha:', password);
    console.log('Perfil:', result.rows[0].role);
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('✗ Erro: Usuário já existe');
    } else {
      console.error('✗ Erro ao criar usuário:', error.message);
    }
    await pool.end();
    process.exit(1);
  }
}

createAdmin();
