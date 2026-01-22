import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface Transaction {
  id: number;
  type: string;
  category: string;
  amount: string;
  description: string;
  transaction_date: string;
}

interface MonthlyCash {
  id: number;
  month: number;
  year: number;
  is_closed: boolean;
}

export default function Financial() {
  const [cash, setCash] = useState<MonthlyCash | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    type: 'entrada',
    category: '',
    amount: '',
    description: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadFinancial();
  }, [month, year]);

  const loadFinancial = async () => {
    try {
      const response = await axios.get(`/api/financial/monthly/${year}/${month}`, {
        withCredentials: true
      });
      setCash(response.data.cash);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Erro ao carregar financeiro');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/financial/transaction', {
        ...formData,
        monthly_cash_id: cash?.id
      }, {
        withCredentials: true
      });
      setShowForm(false);
      setFormData({
        type: 'entrada',
        category: '',
        amount: '',
        description: '',
        transaction_date: new Date().toISOString().split('T')[0]
      });
      loadFinancial();
    } catch (error) {
      alert('Erro ao criar transação');
    }
  };

  const handleCloseMonth = async () => {
    if (!confirm('Fechar o caixa? Esta ação não pode ser desfeita.')) return;
    
    try {
      await axios.post('/api/financial/close-month', {
        monthly_cash_id: cash?.id
      }, {
        withCredentials: true
      });
      loadFinancial();
    } catch (error) {
      alert('Erro ao fechar caixa');
    }
  };

  const totalEntradas = transactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalSaidas = transactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Financeiro</h1>
        <div className="flex gap-4 items-center">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="p-2 text-lg border rounded"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="p-2 text-lg border rounded"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
          {cash?.is_closed && (
            <span className="bg-red-100 text-red-800 px-4 py-2 rounded text-lg">
              Caixa Fechado
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg text-gray-600">Entradas</h3>
          <p className="text-3xl font-bold text-green-700">R$ {totalEntradas.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg">
          <h3 className="text-lg text-gray-600">Saídas</h3>
          <p className="text-3xl font-bold text-red-700">R$ {totalSaidas.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg text-gray-600">Saldo</h3>
          <p className="text-3xl font-bold text-blue-700">R$ {(totalEntradas - totalSaidas).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        {!cash?.is_closed && (
          <>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2 text-lg rounded hover:bg-blue-700"
            >
              {showForm ? 'Cancelar' : 'Nova Transação'}
            </button>
            <button
              onClick={handleCloseMonth}
              className="bg-red-600 text-white px-6 py-2 text-lg rounded hover:bg-red-700"
            >
              Fechar Caixa
            </button>
          </>
        )}
      </div>

      {showForm && (
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/40 mb-6">
          <h2 className="text-2xl font-bold mb-4">Nova Transação</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 text-lg border rounded"
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </div>
              <div>
                <label className="block text-lg mb-2">Categoria</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 text-lg border rounded"
                  placeholder="Dízimo, Oferta, Conta, etc"
                  required
                />
              </div>
              <div>
                <label className="block text-lg mb-2">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2 text-lg border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-lg mb-2">Data</label>
                <input
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  className="w-full p-2 text-lg border rounded"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-lg mb-2">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 text-lg border rounded"
                  rows={3}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-600 text-white px-6 py-2 text-lg rounded hover:bg-green-700"
            >
              Salvar
            </button>
          </form>
        </div>
      )}

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/40 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-lg">Data</th>
              <th className="p-4 text-left text-lg">Tipo</th>
              <th className="p-4 text-left text-lg">Categoria</th>
              <th className="p-4 text-left text-lg">Valor</th>
              <th className="p-4 text-left text-lg">Descrição</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t">
                <td className="p-4 text-lg">{new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}</td>
                <td className="p-4 text-lg">
                  <span className={`px-3 py-1 rounded ${
                    transaction.type === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="p-4 text-lg">{transaction.category}</td>
                <td className="p-4 text-lg font-bold">R$ {parseFloat(transaction.amount).toFixed(2)}</td>
                <td className="p-4 text-lg">{transaction.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
