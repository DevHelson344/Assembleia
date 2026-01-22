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
  const churchId = process.argv[5]; // ID da igreja

  try {
    console.log('🔄 Criando usuário...');
    
    // Se não forneceu church_id, listar igrejas disponíveis
    if (!churchId) {
      const churches = await pool.query('SELECT id, name FROM churches ORDER BY id');
      
      if (churches.rows.length === 0) {
        console.log('⚠️  Nenhuma igreja encontrada. Criando igreja padrão...');
        const newChurch = await pool.query(
          "INSERT INTO churches (name, address) VALUES ('Minha Igreja', 'Endereço da Igreja') RETURNING id, name"
        );
        console.log(`✓ Igreja criada: ${newChurch.rows[0].name} (ID: ${newChurch.rows[0].id})`);
        console.log('');
        console.log('Criando usuário para esta igreja...');
        return createUserForChurch(username, password, role, newChurch.rows[0].id);
      }
      
      console.log('\n📋 Igrejas disponíveis:');
      churches.rows.forEach(church => {
        console.log(`   ${church.id} - ${church.name}`);
      });
      console.log('\n💡 Uso: node create-admin.js <username> <password> <role> <church_id>');
      console.log('   Exemplo: node create-admin.js pastor admin123 pastor 1');
      await pool.end();
      process.exit(0);
    }
    
    await createUserForChurch(username, password, role, churchId);
  } catch (error) {
    console.error('✗ Erro:', error.message);
    await pool.end();
    process.exit(1);
  }
}

async function createUserForChurch(username, password, role, churchId) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (username, password_hash, role, church_id) VALUES ($1, $2, $3, $4) RETURNING id, username, role, church_id',
      [username, passwordHash, role, churchId]
    );

    const church = await pool.query('SELECT name FROM churches WHERE id = $1', [churchId]);

    console.log('✓ Usuário criado com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username:', result.rows[0].username);
    console.log('Senha:', password);
    console.log('Perfil:', result.rows[0].role);
    console.log('Igreja:', church.rows[0].name);
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
