import "../styles/globals.css";
import "styles/App.css";
import "react-notifications-component/dist/theme.css";
import type { AppProps } from "next/app";
import connectors from "@/web3/connectors";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";
import { store } from "@/store/root";
import { GlobalModal } from "@/components/context/ModalContext";
import BackgroundAndWalletSelectWrapper from "@/ui/wrappers/BackgroundWrapper";
import { ReactNotifications } from "react-notifications-component";
import ConnectorInitiator from "@/web3/ConnectorInitiator";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { logPageView } from "@/utils/storage";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (router?.asPath) {
      logPageView(router.asPath);
    }
  }, [router.asPath]);

  return (
    <Provider store={store}>
      <Web3ReactProvider connectors={connectors}>
        <div className="h-full w-full">
          <GlobalModal>
            <ConnectorInitiator>
              <BackgroundAndWalletSelectWrapper>
                <Component {...pageProps} />
                <ReactNotifications />
              </BackgroundAndWalletSelectWrapper>
            </ConnectorInitiator>
          </GlobalModal>
        </div>
      </Web3ReactProvider>
    </Provider>
  );
}
