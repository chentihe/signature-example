import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      desiredChainId={ChainId.Localhost}
      chainRpc={ {[ChainId.Localhost]: "http://localhost:8545"} }
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
