// import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminLayout: React.FC = () => {
  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     setIsScrolled(scrollPosition > 50);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Header isScrolled={isScrolled} /> */}
      <div className="flex-grow flex ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
