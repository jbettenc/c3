import { MetaMaskIcon, CoinbaseIcon, WalletConnectIcon } from "../components/icons";
import { Provider } from "../types";
import connectors from "./connectors";

export const METAMASK: Provider = {
  id: "metaMask",
  name: "MetaMask",
  type: "metaMask",
  connector: connectors[0][0],
  check: "isMetaMask",
  logos: [MetaMaskIcon]
};

export const COINBASE: Provider = {
  id: "coinbaseWallet",
  name: "Coinbase Wallet",
  type: "coinbaseWallet",
  connector: connectors[2][0],
  logos: [CoinbaseIcon],
  check: "isCoinbase"
};

export const WALLET_CONNECT: Provider = {
  id: "walletConnect",
  name: "WalletConnect",
  type: "walletConnect",
  connector: connectors[1][0],
  logos: [WalletConnectIcon],
  check: "isWalletConnect"
};
