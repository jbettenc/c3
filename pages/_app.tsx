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
import { HistoryProvider } from "@/ui/wrappers/HistoryWrapper";
import MetricLogger from "@/ui/wrappers/MetricLogger";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <HistoryProvider>
        <MetricLogger>
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
        </MetricLogger>
      </HistoryProvider>
    </Provider>
  );
}
