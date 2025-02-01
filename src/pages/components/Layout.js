import React from 'react';
import Menu from './Menu';
import Footer from './Footer';
import { useRouter } from 'next/router';
import LinksPage from '../links'; // Certifique-se de importar o LinksPage corretamente

const Layout = ({ children }) => {
  const router = useRouter();

  if (router.pathname === '/links') {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      <Menu />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
