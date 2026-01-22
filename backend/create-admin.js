const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createAdmin() {
  const username = process.argv[2] || 'pastor';
  const password = process.argv[3] || 'admin123';
  const role = process.argv[4] || 'pastor';

  try {
    console.log('🔄 Criando usuário...');
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, passwordHash, role]
    );

    console.log('✓ Usuário criado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username:', result.rows[0].username);
    console.log('Senha:', password);
    console.log('Perfil:', result.rows[0].role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
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
