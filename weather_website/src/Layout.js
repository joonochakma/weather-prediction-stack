import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import FAQ from "./pages/faq/FAQ";

const Layout = () => {
  return (
    <>
      <Header /> {/* Render the header at the top of the page */}
      <main>
        {/* This is where the matched child route will show up */}
        <Outlet />
      </main>
      <FAQ /> {/* Display the FAQ section below the main content */}
      <Footer /> {/* Render the footer at the bottom */}
    </>
  );
};

export default Layout;
