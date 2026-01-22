const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    console.log('🔄 Conectando ao Neon...');
    
    const schema = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf-8');
    
    console.log('🔄 Criando tabelas...');
    await pool.query(schema);
    
    console.log('✓ Tabelas criadas com sucesso!');
    console.log('✓ Banco configurado!');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro ao criar tabelas:', error.message);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();
