"use client";

import { Suspense } from "react";

import ScrollTopToBottom from "../components/buttons/ScrollTopToBottom";
// import ChatBot from "../ai/ChatBot"
import BrochureButton from "../components/buttons/BrochureButton";
import ReviewModal from "../components/modals/ReviewModal";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <Provider store={store}>
        <Suspense>
          {children}
          <ScrollTopToBottom />
          <BrochureButton />
          <ReviewModal />
        </Suspense>
      </Provider>
    </>
  );
};

export default AppProvider;
