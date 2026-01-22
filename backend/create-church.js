const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createChurch() {
  const name = process.argv[2];
  const address = process.argv[3] || '';

  if (!name) {
    console.log('💡 Uso: node create-church.js "<nome da igreja>" "<endereço>"');
    console.log('   Exemplo: node create-church.js "Igreja Central" "Rua Principal, 123"');
    process.exit(0);
  }

  try {
    console.log('🔄 Criando igreja...');
    
    const result = await pool.query(
      'INSERT INTO churches (name, address) VALUES ($1, $2) RETURNING id, name, address',
      [name, address]
    );

    console.log('✓ Igreja criada com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID:', result.rows[0].id);
    console.log('Nome:', result.rows[0].name);
    console.log('Endereço:', result.rows[0].address || '(não informado)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 Use este ID para criar usuários:');
    console.log(`   node create-admin.js pastor senha123 pastor ${result.rows[0].id}`);
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Erro ao criar igreja:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createChurch();
