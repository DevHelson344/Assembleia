import { pool } from '../src/db';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Carregar .env do diretório backend
dotenv.config({ path: join(__dirname, '../.env') });

async function setupDatabase() {
  try {
    console.log('🔄 Conectando ao Neon...');
    console.log('Database URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    const schema = readFileSync(join(__dirname, '../../database/schema.sql'), 'utf-8');
    
    console.log('🔄 Criando tabelas...');
    await pool.query(schema);
    
    console.log('✓ Tabelas criadas com sucesso!');
    console.log('✓ Banco configurado!');
    
    await pool.end();
    process.exit(0);
  } catch (error: any) {
    console.error('✗ Erro ao criar tabelas:', error.message);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();
