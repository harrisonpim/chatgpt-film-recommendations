import "../styles/app.css";

import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${inter.className} mx-auto min-h-screen lg:w-2/3 xl:w-1/2 md:px-4 lg:px-0`}
    >
      <Component {...pageProps} />
    </main>
  );
}
