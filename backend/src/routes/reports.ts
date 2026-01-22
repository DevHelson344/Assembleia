import { Router } from 'express';
import { pool } from '../db';
import { authenticate } from '../middleware/auth';
import PDFDocument from 'pdfkit';

export const reportsRouter = Router();

reportsRouter.get('/financial/:year/:month', async (req, res) => {
  const { year, month } = req.params;
  const token = req.query.token || req.headers.authorization?.split(' ')[1];

  // Validar token
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const cashResult = await pool.query(
      'SELECT * FROM monthly_cash WHERE year = $1 AND month = $2',
      [year, month]
    );

    if (cashResult.rows.length === 0) {
      // Criar caixa se não existir
      const newCash = await pool.query(
        'INSERT INTO monthly_cash (year, month) VALUES ($1, $2) RETURNING *',
        [year, month]
      );
      
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=relatorio-${year}-${month}.pdf`);
      doc.pipe(res);
      
      doc.fontSize(20).text('Relatório Financeiro', { align: 'center' });
      doc.fontSize(14).text(`Mês: ${month}/${year}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text('Nenhuma transação registrada neste período.');
      doc.end();
      return;
    }

    const transactions = await pool.query(
      'SELECT * FROM transactions WHERE monthly_cash_id = $1 ORDER BY transaction_date',
      [cashResult.rows[0].id]
    );

    const entradas = transactions.rows
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const saidas = transactions.rows
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-${year}-${month}.pdf`);

    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(24).text('Relatório Financeiro', { align: 'center' });
    doc.fontSize(16).text(`Período: ${month}/${year}`, { align: 'center' });
    doc.moveDown(2);

    // Resumo
    doc.fontSize(14).text('RESUMO FINANCEIRO', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Total de Entradas: R$ ${entradas.toFixed(2)}`, { continued: false });
    doc.text(`Total de Saídas: R$ ${saidas.toFixed(2)}`, { continued: false });
    doc.fontSize(14).text(`Saldo Final: R$ ${(entradas - saidas).toFixed(2)}`, { bold: true });
    doc.moveDown(2);

    // Transações
    if (transactions.rows.length > 0) {
      doc.fontSize(14).text('TRANSAÇÕES DETALHADAS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);
      
      transactions.rows.forEach((t, index) => {
        const date = new Date(t.transaction_date).toLocaleDateString('pt-BR');
        const typeLabel = t.type === 'entrada' ? 'ENTRADA' : 'SAÍDA';
        doc.text(`${index + 1}. ${date} | ${typeLabel} | ${t.category} | R$ ${parseFloat(t.amount).toFixed(2)}`);
        if (t.description) {
          doc.fontSize(9).text(`   ${t.description}`, { color: 'gray' });
          doc.fontSize(10);
        }
        doc.moveDown(0.3);
      });
    } else {
      doc.fontSize(12).text('Nenhuma transação registrada neste período.');
    }

    doc.end();
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro ao gerar relatório' });
  }
});
