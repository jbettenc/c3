import "../styles/globals.css";
import "styles/App.css";
import "react-notifications-component/dist/theme.css";
import * as Sentry from "@sentry/react";
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
import PageError from "@/components/pages/PageError";

export default function App({ Component, pageProps }: AppProps) {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new Sentry.BrowserTracing()],
      tracesSampleRate: 1.0,
      enabled: true
    });
  }

  return (
    <Sentry.ErrorBoundary fallback={<PageError />}>
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
    </Sentry.ErrorBoundary>
  );
}
