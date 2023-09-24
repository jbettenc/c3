import { InjectedConnector } from "@web3-react/injected-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { INJECTED_SUPPORTED_CHAIN_IDS } from "../../constants/constants";

export const injected = new InjectedConnector({ supportedChainIds: INJECTED_SUPPORTED_CHAIN_IDS });

export const torus = new TorusConnector({
  chainId: 1,
  initOptions: {
    showTorusButton: false
  }
});

export const walletConnect = new WalletConnectConnector({
  rpc: { 1: "https://eth-mainnet.alchemyapi.io/v2/xTrIufa8bBMhQmEc14yrjDOV0yKIka9r" },
  chainId: 1,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true
});

export const walletLink = new WalletLinkConnector({
  url: "https://base-goerli.g.alchemy.com/v2/C9AsPfiYm2YWRnCHy5QXWDlRD3FqktoH", // `https://eth-mainnet.alchemyapi.io/v2/xTrIufa8bBMhQmEc14yrjDOV0yKIka9r`,
  appName: "c3"
});

export const connectors = {
  injected: injected,
  walletConnect: walletConnect,
  coinbaseWallet: walletLink,
  torus: torus
};
