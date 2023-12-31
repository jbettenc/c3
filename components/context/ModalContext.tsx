import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { ConfirmView, Custom, Share, SwitchNetwork, TransactionFlow, WalletSelect } from "../modals";
import Modal, { ModalProps } from "@/ui/modals/Modal";
import WorldIdVerify from "../modals/WorldIdVerify";
import SignPetition from "../modals/SignPetition";
import ReportPetition from "../modals/ReportPetition";
import ErrorLoadingPetition from "../modals/ErrorLoadingPetition";
import Loading from "../modals/Loading";

export enum MODAL_TYPE {
  CONFIRM_VIEW = "CONFIRM_VIEW",
  TRANSACTION_FLOW = "TRANSACTION_FLOW",
  WALLET_SELECT = "WALLET_SELECT",
  WORLD_ID_VERIFY = "WORLD_ID_VERIFY",
  SIGN_PETITION = "SIGN_PETITION",
  SHARE = "SHARE",
  SWITCH_NETWORK = "SWITCH_NETWORK",
  REPORT_PETITION = "REPORT_PETITION",
  ERROR_LOADING_PETITION = "ERROR_LOADING_PETITION",
  LOADING = "LOADING",
  CUSTOM = "CUSTOM"
}

const MODAL_COMPONENTS: any = {
  [MODAL_TYPE.CONFIRM_VIEW]: ConfirmView,
  [MODAL_TYPE.TRANSACTION_FLOW]: TransactionFlow,
  [MODAL_TYPE.SHARE]: Share,
  [MODAL_TYPE.WORLD_ID_VERIFY]: WorldIdVerify,
  [MODAL_TYPE.SIGN_PETITION]: SignPetition,
  [MODAL_TYPE.WALLET_SELECT]: WalletSelect,
  [MODAL_TYPE.SWITCH_NETWORK]: SwitchNetwork,
  [MODAL_TYPE.REPORT_PETITION]: ReportPetition,
  [MODAL_TYPE.ERROR_LOADING_PETITION]: ErrorLoadingPetition,
  [MODAL_TYPE.LOADING]: Loading,
  [MODAL_TYPE.CUSTOM]: Custom
};

type GlobalModalContext = {
  showModal: (modalType: MODAL_TYPE, modalProps?: any, modalWrapperProps?: any, hideOnPathnameChange?: boolean) => void;
  hideModal: (closeAll?: boolean, bypassPreventClose?: boolean) => void;
  hideModalsOfType: (type: MODAL_TYPE, bypassPreventClose?: boolean) => void;
  getTopModalType: () => MODAL_TYPE | undefined;
  store: any;
};

const initalState: GlobalModalContext = {
  showModal: () => {},
  hideModal: () => {},
  hideModalsOfType: () => {},
  getTopModalType: () => undefined,
  store: {}
};

const GlobalModalContext = createContext(initalState);
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal = ({ children }: any) => {
  const [store, setStore] = useState<{
    modalType: MODAL_TYPE;
    modalProps: any;
    modalWrapperProps: Partial<ModalProps> & { preventModalClose?: boolean; modalType?: MODAL_TYPE };
  }>({} as any);
  const openedModals = useRef([] as any[]);
  const { modalType, modalProps, modalWrapperProps } = store;
  const [shouldEnableScroll, handleShouldEnableScroll] = useState(false);

  const showModal = (
    modalType: MODAL_TYPE,
    modalProps: any = {},
    modalWrapperProps: Partial<ModalProps & { preventModalClose?: boolean }> = {},
    hideOnPathnameChange: boolean = true
  ) => {
    openedModals.current.push({
      modalType,
      modalProps,
      modalWrapperProps
    });
    setStore({
      ...store,
      modalType,
      modalProps,
      modalWrapperProps: { ...modalWrapperProps, modalType, hideOnPathnameChange, modalOpen: true }
    });
  };

  const hideModal = (closeAll?: boolean, bypassPreventClose?: boolean) => {
    if (!store.modalWrapperProps?.preventModalClose || bypassPreventClose) {
      if (closeAll) {
        openedModals.current = [];
        setStore({
          ...store,
          modalWrapperProps: { ...modalWrapperProps, modalOpen: false }
        });
      } else {
        if (openedModals.current.length > 1) {
          setStore({
            ...store,
            modalType: openedModals.current[openedModals.current.length - 2].modalType,
            modalProps: openedModals.current[openedModals.current.length - 2].modalProps,
            modalWrapperProps: {
              ...openedModals.current[openedModals.current.length - 2].modalWrapperProps,
              modalOpen: true
            }
          });
        } else {
          setStore({
            ...store,
            modalWrapperProps: { ...modalWrapperProps, modalOpen: false }
          });
        }
        openedModals.current.pop();
      }
    } else {
      if (closeAll) {
        openedModals.current = [];
        setStore({
          ...store,
          modalWrapperProps: { ...modalWrapperProps, modalOpen: false }
        });
      }
    }
  };

  const hideModalsOfType = (type: MODAL_TYPE, bypassPreventClose?: boolean) => {
    openedModals.current = openedModals.current.filter(
      (modal) => modal.modalType !== type || (!bypassPreventClose && modal.modalWrapperProps?.preventModalClose)
    );
    if (openedModals.current.length > 1) {
      setStore({
        ...store,
        modalType: openedModals.current[openedModals.current.length - 1].modalType,
        modalProps: openedModals.current[openedModals.current.length - 1].modalProps,
        modalWrapperProps: {
          ...openedModals.current[openedModals.current.length - 1].modalWrapperProps,
          modalOpen: true
        }
      });
    } else {
      setStore({
        ...store,
        modalWrapperProps: { ...modalWrapperProps, modalOpen: false }
      });
    }
  };

  const getTopModalType = () => {
    // @ts-ignore
    return openedModals.current.length > 0
      ? openedModals.current[openedModals.current.length - 1].modalType
      : undefined;
  };

  const renderComponent = () => {
    const ModalComponent = MODAL_COMPONENTS[modalType];
    if (!modalType || !ModalComponent) {
      return null;
    }
    return (
      <Modal {...(modalWrapperProps as any)}>
        <ModalComponent id="global-modal" {...modalProps} />
      </Modal>
    );
  };

  useEffect(() => {
    if (store.modalWrapperProps && store.modalWrapperProps.modalOpen) {
      if (!document.body.classList.contains("noscroll")) {
        document.body.classList.add("noscroll");
        handleShouldEnableScroll(true);
      }
    } else {
      if (shouldEnableScroll && document.body.classList.contains("noscroll")) {
        document.body.classList.remove("noscroll");
      }
    }
  }, [store]);

  return (
    <GlobalModalContext.Provider value={{ store, showModal, hideModal, hideModalsOfType, getTopModalType }}>
      {store.modalWrapperProps && store.modalWrapperProps.modalOpen && renderComponent()}
      {children}
    </GlobalModalContext.Provider>
  );
};
