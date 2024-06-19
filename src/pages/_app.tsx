import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
        <Component {...pageProps} />
      </main >
    </SessionProvider>
  );
}
