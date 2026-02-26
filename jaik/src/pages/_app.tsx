import type { AppProps } from "next/app";
import AppProvider from "@/providers/AppProvider";
import "@/app/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
