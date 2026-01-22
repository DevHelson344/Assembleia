import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { join } from 'path';
import { authRouter } from './routes/auth';
import { membersRouter } from './routes/members';
import { financialRouter } from './routes/financial';
import { reportsRouter } from './routes/reports';

dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);
app.use('/api/financial', financialRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`✓ Server rodando na porta ${PORT}`);
});
