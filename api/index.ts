import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from '../backend/src/routes/auth';
import { membersRouter } from '../backend/src/routes/members';
import { financialRouter } from '../backend/src/routes/financial';
import { reportsRouter } from '../backend/src/routes/reports';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);
app.use('/api/financial', financialRouter);
app.use('/api/reports', reportsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
