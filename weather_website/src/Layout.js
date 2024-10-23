import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer'; 
import FAQ from './pages/faq/FAQ';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        {/* The Outlet component will render the current matched child route */}
        <Outlet />
      </main>
      <FAQ/>
      <Footer />
    </>
  );
};

export default Layout;