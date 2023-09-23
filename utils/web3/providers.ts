import {
  Web3DefaultLogoIcon,
  MetaMaskIcon,
  CoinbaseIcon,
  WalletConnectIcon,
  GoogleIcon,
  imTokenLogoIcon,
  TwitterIcon,
  DiscordIcon
} from "../../components/icons";
import { Provider } from "../../types";
import { injected, torus, walletConnect, walletLink } from "./connectors";

export const FALLBACK: Provider = {
  id: "injected",
  name: "Web3",
  logos: [Web3DefaultLogoIcon],
  type: "injected",
  check: "isWeb3",
  description: "Connect to Web3",
  connector: injected
};

export const METAMASK: Provider = {
  id: "injected",
  name: "MetaMask",
  type: "injected",
  connector: injected,
  check: "isMetaMask",
  logos: [MetaMaskIcon]
};

export const IMTOKEN: Provider = {
  id: "injected",
  name: "imToken",
  logos: [imTokenLogoIcon],
  type: "injected",
  check: "isImToken",
  description: "Connect to your imToken Wallet",
  connector: injected
};

export const TORUS: Provider = {
  id: "torus",
  name: "Social Media",
  type: "torus",
  description: "Supported by Web3Auth",
  connector: torus,
  check: "isTorus",
  logos: [DiscordIcon, TwitterIcon, GoogleIcon]
};

export const COINBASE: Provider = {
  id: "walletLink",
  name: "Coinbase Wallet",
  type: "walletLink",
  connector: walletLink,
  logos: [CoinbaseIcon],
  check: "isCoinbase"
};

export const WALLET_CONNECT: Provider = {
  id: "walletConnect",
  name: "WalletConnect",
  type: "walletConnect",
  connector: walletConnect,
  logos: [WalletConnectIcon],
  check: "isWalletConnect"
};
