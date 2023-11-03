import { RootState } from "@/store/root";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";
import { getAddChainParameters } from "@/web3/chains";
import connectors from "@/web3/connectors";
import { MetaMask } from "@web3-react/metamask";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { DEFAULT_CHAIN_ID } from "@/constants/constants";
import { MODAL_TYPE, useGlobalModalContext } from "@/components/context/ModalContext";

function ConnectorInitiator(props: any) {
  const [error, setError] = useState<string>();

  const { isActive, chainId } = useWeb3React();
  const { showModal, getTopModalType, hideModal } = useGlobalModalContext();
  const loginType = useSelector((state: RootState) => state.user.loginType);

  useEffect(() => {
    if (isActive) {
      return;
    }
    let connector: MetaMask | WalletConnectV2 | CoinbaseWallet | undefined = undefined;
    switch (loginType) {
      case "metaMask":
        connector = connectors[0][0];
        break;
      case "walletConnect":
        connector = connectors[1][0];
        break;
      case "coinbaseWallet":
        connector = connectors[2][0];
        break;
    }

    if (!connector) {
      return;
    }

    if (connector?.connectEagerly) {
      connector.connectEagerly().catch((err) => console.log(err));
    }
  }, []);

  // Show modal if wrong chain is detected
  useEffect(() => {
    if (isActive && chainId !== undefined) {
      if (chainId !== DEFAULT_CHAIN_ID) {
        if (getTopModalType() !== MODAL_TYPE.SWITCH_NETWORK) {
          showModal(
            MODAL_TYPE.SWITCH_NETWORK,
            { switchChain: () => switchChain(loginType, DEFAULT_CHAIN_ID) },
            { showHeader: false, border: false, preventModalClose: true }
          );
        }
      } else {
        if (getTopModalType() === MODAL_TYPE.SWITCH_NETWORK) {
          hideModal(false, true);
        }
      }
    }
  }, [isActive, chainId, loginType]);

  // This can be used to switch chains (and activate the connection) using a desired connector
  const switchChain = useCallback(
    async (desiredConnector: "metaMask" | "coinbaseWallet" | "walletConnect" | undefined, desiredChainId: number) => {
      let connector: MetaMask | WalletConnectV2 | CoinbaseWallet | undefined = undefined;
      switch (desiredConnector) {
        case "metaMask":
          connector = connectors[0][0];
          break;
        case "walletConnect":
          connector = connectors[1][0];
          break;
        case "coinbaseWallet":
          connector = connectors[2][0];
          break;
      }

      if (!connector) {
        return;
      }

      try {
        if (desiredChainId === -1) {
          await connector.activate();
        } else if (connector instanceof WalletConnectV2) {
          await connector.activate(desiredChainId);
        } else {
          await connector.activate(getAddChainParameters(desiredChainId));
        }

        setError(undefined);
      } catch (error: any) {
        setError(error);
      }
    },
    [setError]
  );

  return props.children;
}

export default ConnectorInitiator;
