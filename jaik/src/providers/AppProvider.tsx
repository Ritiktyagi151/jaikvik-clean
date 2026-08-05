"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import ScrollTopToBottom from "../components/buttons/ScrollTopToBottom";
// import ChatBot from "../ai/ChatBot"
import BrochureButton from "../components/buttons/BrochureButton";
import ReviewModalGate from "../components/modals/ReviewModalGate";

const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();
  const shouldShowScrollToTop = pathname !== "/brochure";

  return (
    <>
      <Suspense>
        {children}
        {shouldShowScrollToTop && <ScrollTopToBottom />}
        <BrochureButton />
        <ReviewModalGate />
      </Suspense>
    </>
  );
};

export default AppProvider;
