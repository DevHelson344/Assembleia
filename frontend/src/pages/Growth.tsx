import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface GrowthData {
  month: string;
  year: number;
  total: number;
  active: number;
  new: number;
  departments: {
    criancas: number;
    jovens: number;
    senhoras: number;
    obreiros: number;
    homens: number;
  };
}

interface GrowthProps {
  onLogout?: () => void;
}

export default function Growth({ onLogout }: GrowthProps) {
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    loadGrowthData();
  }, [months]);

  const loadGrowthData = async () => {
    try {
      const response = await axios.get(`/api/members/growth/${months}`, {
        withCredentials: true
      });
      setGrowthData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados de crescimento');
      setLoading(false);
    }
  };

  const departmentLabels: { [key: string]: string } = {
    criancas: 'Crianças',
    jovens: 'Jovens',
    senhoras: 'Senhoras',
    obreiros: 'Obreiros',
    homens: 'Homens'
  };

  const departmentColors: { [key: string]: string } = {
    criancas: '#ec4899',
    jovens: '#a855f7',
    senhoras: '#f43f5e',
    obreiros: '#f97316',
    homens: '#06b6d4'
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </Layout>
    );
  }

  const latestData = growthData[growthData.length - 1];
  const previousData = growthData[growthData.length - 2];
  const growthRate = previousData 
    ? ((latestData.active - previousData.active) / previousData.active * 100).toFixed(1)
    : '0';

  // Calcular máximo para escala do gráfico
  const maxValue = Math.max(...growthData.map(d => d.active));
  const chartHeight = 200;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Crescimento da Igreja</h1>
            <p className="text-gray-600 mt-1">Acompanhe a evolução dos membros</p>
          </div>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={3}>Últimos 3 meses</option>
            <option value={6}>Últimos 6 meses</option>
            <option value={12}>Últimos 12 meses</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-blue-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total de Membros</p>
              <p className="text-3xl font-bold text-blue-600">{latestData?.total || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/95 to-green-50/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-green-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Membros Ativos</p>
              <p className="text-3xl font-bold text-green-600">{latestData?.active || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/95 to-purple-50/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-purple-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Novos este Mês</p>
              <p className="text-3xl font-bold text-purple-600">{latestData?.new || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/95 to-indigo-50/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-indigo-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Taxa de Crescimento</p>
              <p className={`text-3xl font-bold ${parseFloat(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthRate}%
              </p>
            </div>
            <div className={`p-3 rounded-xl shadow-lg ${parseFloat(growthRate) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${parseFloat(growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Linha - Crescimento Geral */}
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Evolução de Membros Ativos</h2>
        
        <div className="relative" style={{ height: chartHeight + 60 }}>
          {/* Grid horizontal */}
          <div className="absolute inset-0 flex flex-col justify-between" style={{ height: chartHeight }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-200"></div>
            ))}
          </div>

          {/* Linha do gráfico */}
          <svg className="absolute inset-0" style={{ height: chartHeight }}>
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={growthData.map((data, index) => {
                const x = (index / (growthData.length - 1)) * 100;
                const y = chartHeight - (data.active / maxValue) * chartHeight;
                return `${x}%,${y}`;
              }).join(' ')}
            />
            {/* Pontos */}
            {growthData.map((data, index) => {
              const x = (index / (growthData.length - 1)) * 100;
              const y = chartHeight - (data.active / maxValue) * chartHeight;
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={y}
                    r="5"
                    fill="#3b82f6"
                    className="hover:r-7 transition-all cursor-pointer"
                  />
                  <text
                    x={`${x}%`}
                    y={y - 15}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700"
                  >
                    {data.active}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Labels do eixo X */}
          <div className="absolute flex justify-between w-full" style={{ top: chartHeight + 10 }}>
            {growthData.map((data, index) => (
              <div key={index} className="text-xs text-gray-600 text-center" style={{ width: `${100 / growthData.length}%` }}>
                {data.month}/{data.year}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Barras - Por Departamento */}
      <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Membros Ativos por Departamento</h2>
        
        <div className="space-y-6">
          {Object.entries(departmentLabels).map(([key, label]) => {
            const currentValue = latestData?.departments[key as keyof typeof latestData.departments] || 0;
            const maxDeptValue = Math.max(...Object.values(latestData?.departments || {}));
            const percentage = maxDeptValue > 0 ? (currentValue / maxDeptValue) * 100 : 0;

            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                  <span className="text-sm font-bold text-gray-800">{currentValue} membros</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: departmentColors[key]
                    }}
                  >
                    {percentage > 15 && (
                      <span className="text-xs font-semibold text-white">
                        {percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela de Evolução por Departamento */}
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico Mensal por Departamento</h3>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mês</th>
                {Object.values(departmentLabels).map((label) => (
                  <th key={label} className="px-4 py-3 text-center text-sm font-semibold text-gray-700">{label}</th>
                ))}
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total Ativos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {growthData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                    {data.month}/{data.year}
                  </td>
                  {Object.keys(departmentLabels).map((key) => (
                    <td key={key} className="px-4 py-3 text-center text-sm text-gray-700">
                      {data.departments[key as keyof typeof data.departments]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center text-sm font-bold text-gray-800">
                    {data.active}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
