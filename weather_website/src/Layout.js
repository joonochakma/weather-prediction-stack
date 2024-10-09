import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        {/* The Outlet component will render the current matched child route */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;