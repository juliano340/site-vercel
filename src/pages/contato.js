import { useState } from 'react';
import Breadcrumb from './components/Breadcrumb';

const Contato = () => {
  const initialFormData = {
    nome: '',
    email: '',
    mensagem: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData(initialFormData);
      } else {
        const errorData = await response.json();
        setStatus('error');
        console.error(errorData.error);
      }
    } catch (error) {
      setStatus('error');
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      title: 'LinkedIn',
      content: 'linkedin.com/in/juliano340',
      link: 'https://www.linkedin.com/in/juliano340'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      title: 'GitHub',
      content: 'github.com/juliano340',
      link: 'https://github.com/juliano340'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      content: ['juliano340', 'gmail.com'].join('@'),
      link: `mailto:${['juliano340', 'gmail.com'].join('@')}`
    }
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background px-4 py-12 text-primary transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <Breadcrumb paths={[{ label: 'Home', href: '/' }, { label: 'Contato', href: '/contato' }]} />

        {/* Header */}
        <div className="mb-16 mt-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">
            Vamos Conversar?
          </h1>
          <div className="mx-auto mb-6 h-px w-24 bg-subtle"></div>
          <p className="mx-auto max-w-2xl text-xl text-muted">
            Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades de fazer parte da sua visão.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="mono-panel">
              <h3 className="mb-6 text-2xl font-bold text-primary">Informações de Contato</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index}>
                    <a
                      href={info.link}
                      {...(info.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="mono-focus-ring group flex items-start gap-4 rounded-xl border border-subtle bg-background p-4 transition-all duration-300 hover:bg-surface hover:border-primary"
                    >
                      <div className="flex-shrink-0 rounded-lg border border-subtle bg-surface p-3 text-primary transition-transform duration-300 group-hover:scale-110">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 font-semibold text-primary">{info.title}</h4>
                        <p className="break-all text-sm text-muted transition-colors group-hover:text-primary">
                          {info.content}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mono-panel bg-surface">
              <h3 className="mb-4 text-xl font-bold text-primary">Resposta Rápida</h3>
              <p className="mb-4 text-muted">
                Normalmente respondo em até 24 horas
              </p>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-pulse text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-primary">Disponível para projetos</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="mono-panel p-8 md:p-12">
              <div className="space-y-6">
                {/* Nome */}
                <div>
                  <label htmlFor="nome" className="mb-2 block text-sm font-semibold text-primary">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={handleChange}
                      className="mono-focus-ring block w-full rounded-xl border border-subtle bg-background py-3 pl-12 pr-4 text-primary placeholder:text-muted transition-all duration-300 focus:border-primary"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-semibold text-primary">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="mono-focus-ring block w-full rounded-xl border border-subtle bg-background py-3 pl-12 pr-4 text-primary placeholder:text-muted transition-all duration-300 focus:border-primary"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label htmlFor="mensagem" className="mb-2 block text-sm font-semibold text-primary">
                    Mensagem
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <svg className="h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      required
                      value={formData.mensagem}
                      onChange={handleChange}
                      rows="6"
                      className="mono-focus-ring block w-full resize-none rounded-xl border border-subtle bg-background py-3 pl-12 pr-4 text-primary placeholder:text-muted transition-all duration-300 focus:border-primary"
                      placeholder="Escreva sua mensagem aqui..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="mono-focus-ring group relative flex w-full items-center justify-center gap-2 rounded-xl border border-primary bg-primary px-6 py-4 text-base font-semibold text-background shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Mensagem
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="animate-fadeIn mt-6 flex items-start gap-3 rounded-xl border border-subtle bg-surface p-4">
                  <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                      <h4 className="font-semibold text-primary">Mensagem enviada com sucesso!</h4>
                      <p className="mt-1 text-sm text-muted">Obrigado pelo contato. Responderei em breve!</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="animate-fadeIn mt-6 flex items-start gap-3 rounded-xl border border-subtle bg-surface p-4">
                  <svg className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                      <h4 className="font-semibold text-primary">Erro ao enviar mensagem</h4>
                      <p className="mt-1 text-sm text-muted">Por favor, tente novamente ou entre em contato por email.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contato;
