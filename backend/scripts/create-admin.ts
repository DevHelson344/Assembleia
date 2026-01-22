import bcrypt from 'bcrypt';
import { pool } from '../src/db';
import dotenv from 'dotenv';
import { join } from 'path';

// Carregar .env do diretório backend
dotenv.config({ path: join(__dirname, '../.env') });

async function createAdmin() {
  const username = process.argv[2];
  const password = process.argv[3] || 'senha123';
  const churchId = process.argv[4];
  const role = process.argv[5] || 'admin';

  if (!username || !churchId) {
    console.log('❌ Uso: npm run create-admin <username> <senha> <church_id> [role]');
    console.log('Exemplo: npm run create-admin admin@minhaigreja senha123 1 admin');
    process.exit(1);
  }

  try {
    console.log('🔄 Conectando ao banco...');
    
    // Verifica se a igreja existe
    const churchCheck = await pool.query('SELECT id, name FROM churches WHERE id = $1', [churchId]);
    if (churchCheck.rows.length === 0) {
      console.error('❌ Igreja não encontrada! Crie a igreja primeiro.');
      await pool.end();
      process.exit(1);
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role, church_id) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
      [username, passwordHash, role, churchId]
    );

    console.log('\n✅ Usuário criado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Igreja:', churchCheck.rows[0].name);
    console.log('Username:', result.rows[0].username);
    console.log('Senha:', password);
    console.log('Perfil:', result.rows[0].role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.error('❌ Erro: Usuário já existe');
    } else {
      console.error('❌ Erro ao criar usuário:', error.message);
    }
    await pool.end();
    process.exit(1);
  }
}

createAdmin();
