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

async function migrate() {
  try {
    console.log('🔄 Executando migração para multi-igreja...');
    
    const migration = fs.readFileSync(
      path.join(__dirname, '../database/migration-add-churches.sql'),
      'utf-8'
    );
    
    await pool.query(migration);
    
    console.log('✓ Migração concluída com sucesso!');
    console.log('✓ Sistema agora suporta múltiplas igrejas');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro na migração:', error.message);
    await pool.end();
    process.exit(1);
  }
}

migrate();
