import { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected } from "../web3/connectors";

export const useInactiveListener = (suppress = false): void => {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        activate(injected);
      };

      // args: chainId: number
      const handleChainChanged = () => {
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string) => {
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      // args: networkId: number
      const handleNetworkChanged = () => {
        activate(injected);
      };

      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        ethereum.removeListener?.("connect", handleConnect);
        ethereum.removeListener?.("chainChanged", handleChainChanged);
        ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
        ethereum.removeListener?.("networkChanged", handleNetworkChanged);
      };
    }
  }, [active, error, suppress, activate]);
};
