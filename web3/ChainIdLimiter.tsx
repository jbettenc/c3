import { MODAL_TYPE, useGlobalModalContext } from "@/components/context/ModalContext";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";

function ChainIdLimiter(props: any) {
  const { active, library } = useWeb3React();

  const { showModal, getTopModalType, hideModal } = useGlobalModalContext();

  useEffect(() => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && active && library) {
      // args: chainId: number
      const handleChainChanged = (chainId: number | string) => {
        if (chainId !== "0x13881" && chainId !== 80001) {
          if (getTopModalType() !== MODAL_TYPE.SWITCH_NETWORK) {
            showModal(MODAL_TYPE.SWITCH_NETWORK, {}, { showHeader: false, border: false, preventModalClose: true });
          }
        } else {
          if (getTopModalType() === MODAL_TYPE.SWITCH_NETWORK) {
            hideModal();
          }
        }
      };

      (async () => {
        handleChainChanged((await library.getNetwork()).chainId);
      })();

      ethereum.on("chainChanged", handleChainChanged);
      return () => {
        ethereum.removeListener?.("chainChanged", handleChainChanged);
      };
    }
  }, [active, library]);

  return props.children;
}

export default ChainIdLimiter;
