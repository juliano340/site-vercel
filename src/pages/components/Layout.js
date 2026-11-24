import React from 'react';
import Menu from './Menu';
import Footer from './Footer';
import SpotifyNowPlaying from './SpotifyNowPlaying';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const noLayoutRoutes = ['/', '/links', '/terminal'];
  const hideGlobalMenu = router.pathname === '/home';

  if (noLayoutRoutes.includes(router.pathname)) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <>
      {!hideGlobalMenu && <Menu />}
      {children}
      <Footer />
      <SpotifyNowPlaying />
    </>
  );
};

export default Layout;
