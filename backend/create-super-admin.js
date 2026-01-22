const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createSuperAdmin() {
  const username = process.argv[2] || 'admin';
  const password = process.argv[3] || 'admin123';

  try {
    console.log('🔄 Criando super admin...');
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Admin não precisa de church_id (pode ver todas)
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role, church_id) VALUES ($1, $2, $3, NULL) RETURNING id, username, role',
      [username, passwordHash, 'admin']
    );

    console.log('✓ Super Admin criado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username:', result.rows[0].username);
    console.log('Senha:', password);
    console.log('Perfil: Administrador (acesso total)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✓ Este usuário pode ver e gerenciar TODAS as igrejas!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    if (error.code === '23505') {
      console.error('✗ Erro: Usuário já existe');
    } else {
      console.error('✗ Erro ao criar admin:', error.message);
    }
    await pool.end();
    process.exit(1);
  }
}

createSuperAdmin();
