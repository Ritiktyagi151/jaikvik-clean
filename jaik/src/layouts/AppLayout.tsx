"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "../common/navbar/Navbar";
import Footer from "../common/footer/Footer";

const Chatbot = dynamic(() => import("../pages/home/Chatbot"), {
  ssr: false,
  loading: () => null,
});

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
