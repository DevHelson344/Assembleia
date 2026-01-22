import { Pool } from 'pg';
import dotenv from 'dotenv';
import { join } from 'path';

// Carregar .env do diretório backend
dotenv.config({ path: join(__dirname, '../.env') });

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Erro no PostgreSQL:', err);
});
