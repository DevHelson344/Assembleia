import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [showPixModal, setShowPixModal] = useState(false);
  const [formData, setFormData] = useState({
    churchName: '',
    contactName: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPixModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">ChurchManager</h1>
          <button
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Já sou cliente
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Gestão Completa para sua Igreja
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sistema profissional para gerenciar membros, finanças, eventos e relatórios.
          Tudo em um só lugar, simples e organizado.
        </p>
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="text-center">
            <p className="text-5xl font-bold text-indigo-600">R$ 30</p>
            <p className="text-gray-600">por mês</p>
          </div>
        </div>
        <a
          href="#assinar"
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Começar Agora
        </a>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Recursos Inclusos</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">👥</div>
            <h4 className="text-xl font-bold mb-2">Gestão de Membros</h4>
            <p className="text-gray-600">
              Cadastro completo, histórico, departamentos e controle de status
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💰</div>
            <h4 className="text-xl font-bold mb-2">Controle Financeiro</h4>
            <p className="text-gray-600">
              Entradas, saídas, caixa mensal e relatórios detalhados
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-xl font-bold mb-2">Relatórios</h4>
            <p className="text-gray-600">
              Gráficos de crescimento, frequência e análises financeiras
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📅</div>
            <h4 className="text-xl font-bold mb-2">Eventos</h4>
            <p className="text-gray-600">
              Cadastro de cultos, reuniões e controle de presença
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="text-xl font-bold mb-2">Segurança</h4>
            <p className="text-gray-600">
              Controle de acesso por perfil e dados protegidos
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold mb-2">Responsivo</h4>
            <p className="text-gray-600">
              Acesse de qualquer dispositivo, celular, tablet ou computador
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="assinar" className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-3xl font-bold text-center mb-8">Assine Agora</h3>
          
          {!showPixModal ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nome da Igreja *
                </label>
                <input
                  type="text"
                  required
                  value={formData.churchName}
                  onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Gerar PIX - R$ 30,00
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto text-center">
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                <h4 className="text-xl font-bold text-green-800 mb-4">
                  PIX Copia e Cola
                </h4>
                <div className="bg-white p-4 rounded border border-green-300 mb-4 break-all text-sm font-mono">
                  00020126580014br.gov.bcb.pix0136sua-chave-pix-aqui@email.com5204000053039865802BR5925SEU NOME6009SAO PAULO62070503***63041D3D
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136sua-chave-pix-aqui@email.com5204000053039865802BR5925SEU NOME6009SAO PAULO62070503***63041D3D');
                    alert('Código PIX copiado!');
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Copiar Código PIX
                </button>
              </div>

              <div className="text-left bg-blue-50 p-4 rounded-lg mb-6">
                <h5 className="font-bold mb-2">📋 Dados cadastrados:</h5>
                <p className="text-sm"><strong>Igreja:</strong> {formData.churchName}</p>
                <p className="text-sm"><strong>Responsável:</strong> {formData.contactName}</p>
                <p className="text-sm"><strong>E-mail:</strong> {formData.email}</p>
                <p className="text-sm"><strong>WhatsApp:</strong> {formData.phone}</p>
              </div>

              <div className="text-left text-sm text-gray-600 space-y-2">
                <p>✅ Após o pagamento, envie o comprovante para nosso WhatsApp</p>
                <p>✅ Sua conta será ativada em até 2 horas úteis</p>
                <p>✅ Você receberá as credenciais de acesso por e-mail</p>
              </div>

              <a
                href={`https://wa.me/5511999999999?text=Olá! Acabei de fazer o pagamento da assinatura.%0A%0AIgreja: ${formData.churchName}%0AE-mail: ${formData.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                📱 Enviar Comprovante via WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 ChurchManager. Todos os direitos reservados.</p>
          <p className="text-gray-400 mt-2">Suporte: contato@churchmanager.com.br</p>
        </div>
      </footer>
    </div>
  );
}
