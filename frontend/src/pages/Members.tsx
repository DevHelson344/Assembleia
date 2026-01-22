import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

interface Member {
  id: number;
  name: string;
  family: string;
  baptism_date: string;
  status: string;
  department: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterDepartment, setFilterDepartment] = useState('todos');
  const [formData, setFormData] = useState({
    name: '',
    family: '',
    baptism_date: '',
    status: 'ativo',
    department: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/members', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Erro ao carregar membros');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (editingMember) {
        // Atualizar membro existente
        await axios.put(`/api/members/${editingMember.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Criar novo membro
        await axios.post('/api/members', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setShowForm(false);
      setEditingMember(null);
      setFormData({ name: '', family: '', baptism_date: '', status: 'ativo', department: '' });
      loadMembers();
    } catch (error) {
      console.error('Erro ao salvar membro');
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      family: member.family || '',
      baptism_date: member.baptism_date || '',
      status: member.status,
      department: member.department || ''
    });
    setShowForm(true);
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormData({ name: '', family: '', baptism_date: '', status: 'ativo', department: '' });
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.family?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || member.status === filterStatus;
    const matchesDepartment = filterDepartment === 'todos' || member.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const statusColors = {
    ativo: 'bg-green-100 text-green-800',
    afastado: 'bg-yellow-100 text-yellow-800',
    visitante: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    ativo: 'Ativo',
    afastado: 'Afastado',
    visitante: 'Visitante'
  };

  const departmentLabels = {
    criancas: 'Crianças',
    jovens: 'Jovens',
    senhoras: 'Senhoras',
    obreiros: 'Obreiros',
    homens: 'Homens'
  };

  const departmentColors = {
    criancas: 'bg-purple-100 text-purple-800',
    jovens: 'bg-purple-100 text-purple-800',
    senhoras: 'bg-rose-100 text-rose-800',
    obreiros: 'bg-orange-100 text-orange-800',
    homens: 'bg-cyan-100 text-cyan-800'
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Membros</h1>
      </div>
        
      <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome ou família..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos Departamentos</option>
            <option value="criancas">Crianças</option>
            <option value="jovens">Jovens</option>
            <option value="senhoras">Senhoras</option>
            <option value="obreiros">Obreiros</option>
            <option value="homens">Homens</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todas Situações</option>
            <option value="ativo">Ativos</option>
            <option value="afastado">Afastados</option>
            <option value="visitante">Visitantes</option>
          </select>
          <button
            onClick={() => {
              setEditingMember(null);
              setShowForm(!showForm);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            {showForm ? 'Cancelar' : '+ Novo Membro'}
          </button>
        </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {editingMember ? 'Editar Membro' : 'Novo Membro'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Família</label>
                <input
                  type="text"
                  value={formData.family}
                  onChange={(e) => setFormData({ ...formData, family: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Batismo</label>
                <input
                  type="date"
                  value={formData.baptism_date}
                  onChange={(e) => setFormData({ ...formData, baptism_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="criancas">Crianças</option>
                  <option value="jovens">Jovens</option>
                  <option value="senhoras">Senhoras</option>
                  <option value="obreiros">Obreiros</option>
                  <option value="homens">Homens</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Situação *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ativo">Ativo</option>
                  <option value="afastado">Afastado</option>
                  <option value="visitante">Visitante</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingMember ? 'Atualizar Membro' : 'Salvar Membro'}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Família</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Departamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Batismo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Situação</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum membro encontrado
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800">{member.name}</td>
                    <td className="px-6 py-4 text-gray-600">{member.family || '-'}</td>
                    <td className="px-6 py-4">
                      {member.department ? (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${departmentColors[member.department as keyof typeof departmentColors]}`}>
                          {departmentLabels[member.department as keyof typeof departmentLabels]}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {member.baptism_date ? new Date(member.baptism_date).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[member.status as keyof typeof statusColors]}`}>
                        {statusLabels[member.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar membro"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total: {filteredMembers.length} {filteredMembers.length === 1 ? 'membro' : 'membros'}
      </div>
    </Layout>
  );
}
