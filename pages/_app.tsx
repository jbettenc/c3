// import "@/styles/globals.css";
import "../styles/globals.css";
import "styles/App.css";
import "react-notifications-component/dist/theme.css";
import type { AppProps } from "next/app";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import { store } from "@/store/root";
import { GlobalModal } from "@/components/context/ModalContext";
import BackgroundAndWalletSelectWrapper from "@/ui/wrappers/BackgroundWrapper";
import { ReactNotifications } from "react-notifications-component";
import ConnectorInitiator from "@/web3/ConnectorInitiator";

export default function App({ Component, pageProps }: AppProps) {
  const getLibrary = (provider: ExternalProvider) => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 8000;
    return library;
  };

  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <div className="h-full w-full">
          <ConnectorInitiator>
            <GlobalModal>
              <BackgroundAndWalletSelectWrapper>
                <Component {...pageProps} />
                <ReactNotifications />
              </BackgroundAndWalletSelectWrapper>
            </GlobalModal>
          </ConnectorInitiator>
        </div>
      </Web3ReactProvider>
    </Provider>
  );
}
