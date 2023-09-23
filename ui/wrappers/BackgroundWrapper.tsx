import { MODAL_TYPE, useGlobalModalContext } from "@/components/context/ModalContext";
import { RootState } from "@/store/root";
import { setLoginType, setOpenLoginModal } from "@/store/userSlice";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function BackgroundAndWalletSelectWrapper(props: any) {
  const { account } = useWeb3React();
  const { openLoginModal } = useSelector((state: RootState) => state.user);
  const { showModal, hideModal, store } = useGlobalModalContext();
  const dispatch = useDispatch();

  useEffect(() => {
    if (openLoginModal) {
      showModal(
        MODAL_TYPE.WALLET_SELECT,
        {
          handleLoginType: (providerType: string) => {
            dispatch(setLoginType(providerType));
          },
          onClose: () => {
            dispatch(setOpenLoginModal(false));
          }
        },
        {
          showHeader: false,
          transparentBg: true,
          shadow: false,
          border: false,
          onClose: () => {
            hideModal(true);
            dispatch(setOpenLoginModal(false));
          }
        }
      );
    } else {
      // if (store.modalType === MODAL_TYPE.WALLET_SELECT) {
      hideModal(true);
      // }
    }
  }, [openLoginModal]);

  return (
    <div className={`flex min-h-screen font-azo opacity-100 text-white items-stretch bg-dot-pattern bg-fixed bg-white`}>
      {props.children}
    </div>
  );
}

export default BackgroundAndWalletSelectWrapper;
