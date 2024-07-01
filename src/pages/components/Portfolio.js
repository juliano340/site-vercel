import Image from 'next/image';

const projects = [
  {
    title: 'Meu Link',
    description: 'Encurtador de links desenvolvido em React utilizando API do Bitly',
    imageUrl: '/images/meu-link-snapshoot.png',
    projectUrl: 'https://meu-link-xi.vercel.app/',
    repoUrl: 'https://github.com/juliano340/meu-link'
  },
  {
    title: 'Busca CEP',
    description: 'Buscador de CEP desenvolvido com React utilizando a API da ViaCep',
    imageUrl: '/images/busca-cep.png',
    projectUrl: 'https://buscador-cep-ecru.vercel.app/',
    repoUrl: 'https://github.com/juliano340/buscador-cep'
  },
  {
    title: 'J-FLIX',
    description: 'Top 10 Filmes do Momento desenvolvido com React utilizando a API da Themoviedb',
    imageUrl: '/images/j-flix.png',
    projectUrl: 'https://j-flix-ashen.vercel.app/',
    repoUrl: 'https://github.com/juliano340/j-flix'
  },
  {
    title: 'PDV Web (Ponto de Venda)',
    description: 'Sistema de Gestão de Vendas!',
    imageUrl: '/images/pdv.png',
    projectUrl: 'https://pdv-juliano340s-projects.vercel.app/',
    repoUrl: 'https://github.com/juliano340/pdv'
  },
  {
    title: 'CMS - BLOG',
    description: 'Sistema CMS para blog! Desenvolvido com NEXTJS utilizando a API do Notion.',
    imageUrl: '/images/Blog.png',
    projectUrl: 'https://www.juliano340.com/blog',
    repoUrl: 'https://github.com/juliano340/site-vercel'
  },
];

const Portfolio = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-8 text-center">Meu Portfólio</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-700 mb-4">{project.description}</p>
              <div className="flex justify-between">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Ver Projeto
                </a>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Código Fonte
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
