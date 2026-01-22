import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter, membersRouter, financialRouter, reportsRouter } from './routes';

const app = express();

app.use(cors({
  origin: true, // Em produção, especifique o domínio exato
  credentials: true // Permite envio de cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/members', membersRouter);
app.use('/api/financial', financialRouter);
app.use('/api/reports', reportsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
