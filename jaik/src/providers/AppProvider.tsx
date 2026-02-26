"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import ScrollTopToBottom from "../components/buttons/ScrollTopToBottom";
// import ChatBot from "../ai/ChatBot"
import BrochureButton from "../components/buttons/BrochureButton";
import ReviewModal from "../components/modals/ReviewModal";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const pathname = usePathname();
  const shouldShowScrollToTop = pathname !== "/brochure";

  return (
    <>
      <Provider store={store}>
        <Suspense>
          {children}
          {shouldShowScrollToTop && <ScrollTopToBottom />}
          <BrochureButton />
          <ReviewModal />
        </Suspense>
      </Provider>
    </>
  );
};

export default AppProvider;
