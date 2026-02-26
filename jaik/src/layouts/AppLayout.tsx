"use client";

import React from "react";
import Navbar from "../common/navbar/Navbar";
import Footer from "../common/footer/Footer";
import Chatbot from "../pages/home/Chatbot";

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Chatbot />
      <Footer />
    </>
  );
};

export default AppLayout;
