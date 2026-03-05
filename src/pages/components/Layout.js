import React from 'react';
import Menu from './Menu';
import Footer from './Footer';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const noLayoutRoutes = ['/', '/links', '/terminal'];

  if (noLayoutRoutes.includes(router.pathname)) {
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
