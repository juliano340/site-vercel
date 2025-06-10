import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <a href="https://github.com/juliano340" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-github text-2xl" aria-hidden="true"></i>
          </a>
          <a href="https://www.linkedin.com/in/juliano340" target="_blank" rel="noopener noreferrer" className="ml-4">
            <i className="fa-brands fa-linkedin text-2xl" aria-hidden="true"></i>
          </a>
        </div>
        <div className="text-center mt-4">
          &copy; {new Date().getFullYear()} juliano340.com - Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
