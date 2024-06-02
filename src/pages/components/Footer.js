import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold">@JULIANO340</h1>
            <p className="text-gray-400">© 2024 - Todos os direitos reservados</p>
          </div>
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/juliano340" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.linkedin.com/in/juliano340" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://twitter.com/juliano340" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="/" className="hover:text-gray-400">Home</a>
            <a href="#about" className="hover:text-gray-400">Sobre</a>
            <a href="/blog" className="hover:text-gray-400">Blog</a>
            <a href="/contato" className="hover:text-gray-400">Contato</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
