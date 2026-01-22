const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function addAdminRole() {
  try {
    console.log('🔄 Adicionando role admin...');
    
    // Adicionar 'admin' ao CHECK constraint
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('admin', 'pastor', 'tesoureiro', 'secretario'));
    `);
    
    console.log('✓ Role admin adicionada com sucesso!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addAdminRole();
