import type { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { Web3ReactHooks } from "@web3-react/core";
import type { MetaMask } from "@web3-react/metamask";
import type { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

import { coinbaseWallet, hooks as coinbaseWalletHooks } from "./connectors/CoinbaseWallet";
import { hooks as metaMaskHooks, metaMask } from "./connectors/MetaMask";
import { hooks as walletConnectV2Hooks, walletConnectV2 } from "./connectors/WalletConnectV2";

const connectors: [MetaMask | WalletConnectV2 | CoinbaseWallet, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks]
];

export default connectors;
