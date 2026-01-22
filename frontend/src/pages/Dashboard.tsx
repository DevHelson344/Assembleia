import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface Stats {
  totalMembers: number;
  activeMembers: number;
  membersByDepartment: { [key: string]: number };
  membersByStatus: { [key: string]: number };
  recentMembers: any[];
}

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
}

function PieChart({ data }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Sem dados</p>
      </div>
    );
  }

  let currentAngle = -90; // Começar do topo
  const radius = 85;
  const innerRadius = 65; // Rosca mais fina (diferença de 20 ao invés de 30)
  const centerX = 100;
  const centerY = 100;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Pontos externos
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    // Pontos internos
    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
    
    currentAngle = endAngle;
    
    return {
      path: pathData,
      color: item.color,
      label: item.label,
      value: item.value,
      percentage: percentage.toFixed(1)
    };
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-6">
        <svg width="220" height="220" viewBox="0 0 200 200" className="drop-shadow-sm">
          {/* Círculo de fundo para dar profundidade */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 1}
            fill="white"
            className="drop-shadow-sm"
          />
          
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.path}
                fill={slice.color}
                className="hover:opacity-90 transition-all duration-200 cursor-pointer"
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                }}
              />
            </g>
          ))}
        </svg>
        
        {/* Texto no centro da rosca */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-4xl font-bold text-gray-800">{total}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total</div>
        </div>
      </div>
      
      <div className="space-y-3 w-full">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: slice.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{slice.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{slice.value}</span>
              <span className="text-xs text-gray-500">({slice.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0,
    activeMembers: 0,
    membersByDepartment: {},
    membersByStatus: {},
    recentMembers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const members = response.data;
      
      // Calcular estatísticas
      const byDepartment: { [key: string]: number } = {};
      const byStatus: { [key: string]: number } = {};
      
      members.forEach((member: any) => {
        // Por departamento
        if (member.department) {
          byDepartment[member.department] = (byDepartment[member.department] || 0) + 1;
        }
        // Por status
        byStatus[member.status] = (byStatus[member.status] || 0) + 1;
      });

      setStats({
        totalMembers: members.length,
        activeMembers: byStatus.ativo || 0,
        membersByDepartment: byDepartment,
        membersByStatus: byStatus,
        recentMembers: members.slice(0, 5)
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar estatísticas');
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

  const statusLabels: { [key: string]: string } = {
    ativo: 'Ativos',
    afastado: 'Afastados',
    visitante: 'Visitantes'
  };

  const statusColors: { [key: string]: string } = {
    ativo: '#10b981',
    afastado: '#eab308',
    visitante: '#3b82f6'
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

  const totalDepartments = Object.values(stats.membersByDepartment).reduce((a, b) => a + b, 0);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total de Membros</p>
              <p className="text-4xl font-bold">{stats.totalMembers}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Membros Ativos</p>
              <p className="text-4xl font-bold">{stats.activeMembers}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Taxa de Atividade</p>
              <p className="text-4xl font-bold">
                {stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Departamentos */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Departamentos</h2>
          
          {Object.keys(stats.membersByDepartment).length > 0 ? (
            <PieChart
              data={Object.entries(stats.membersByDepartment).map(([dept, count]) => ({
                label: departmentLabels[dept],
                value: count,
                color: departmentColors[dept]
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum membro cadastrado ainda</p>
          )}
        </div>

        {/* Gráfico de Pizza - Status */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Situação</h2>
          
          {Object.keys(stats.membersByStatus).length > 0 ? (
            <PieChart
              data={Object.entries(stats.membersByStatus).map(([status, count]) => ({
                label: statusLabels[status],
                value: count,
                color: statusColors[status]
              }))}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">Nenhum membro cadastrado ainda</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
