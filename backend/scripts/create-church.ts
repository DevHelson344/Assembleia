import { pool } from '../src/db';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../.env') });

async function createChurch() {
  const name = process.argv[2];
  const address = process.argv[3] || '';
  const phone = process.argv[4] || '';

  if (!name) {
    console.log('❌ Uso: npm run create-church "<nome>" "<endereço>" "<telefone>"');
    console.log('Exemplo: npm run create-church "Igreja Batista Central" "Rua X, 123" "(11) 99999-9999"');
    process.exit(1);
  }

  try {
    console.log('🔄 Criando igreja...');
    
    const result = await pool.query(
      'INSERT INTO churches (name, address, phone) VALUES ($1, $2, $3) RETURNING id, name',
      [name, address, phone]
    );

    console.log('\n✅ Igreja criada com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ID:', result.rows[0].id);
    console.log('Nome:', result.rows[0].name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Próximo passo: criar usuário admin');
    console.log(`npm run create-admin admin@igreja senha123 ${result.rows[0].id}\n`);
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao criar igreja:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createChurch();
