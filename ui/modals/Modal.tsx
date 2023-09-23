import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Transition from "@/utils/Transition";
import { useGlobalModalContext } from "@/components/context/ModalContext";

interface ModalProps {
  children?: JSX.Element[];
  id?: string;
  title?: string;
  titleBar?: JSX.Element;
  modalOpen: boolean;
  onClose: () => void;
  maxSizeClass?: string;
  showHeader?: boolean;
  headerSeparator?: boolean;
  transparentBg?: boolean;
  shadow?: boolean;
  border?: boolean;
  hideOnPathnameChange?: boolean;
}

function Modal({
  children,
  id,
  title,
  titleBar,
  modalOpen,
  onClose,
  maxSizeClass = "max-w-lg",
  showHeader = true,
  headerSeparator = true,
  transparentBg = false,
  shadow = true,
  border = true,
  hideOnPathnameChange
}: ModalProps) {
  const modalContent = useRef<HTMLDivElement>(null);
  const { hideModal } = useGlobalModalContext();
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (hideOnPathnameChange) {
        hideModal();
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, hideOnPathnameChange]);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modalContent.current) return;
      if (!modalOpen || modalContent.current.contains(target as Node)) return;
      if (onClose) {
        onClose();
      }
      hideModal();
    };
    document.addEventListener("click", clickHandler, { capture: true });
    return () => document.removeEventListener("click", clickHandler, { capture: true });
  }, [hideModal, modalOpen, onClose]);

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!modalOpen || key !== "Escape") return;
      if (onClose) {
        onClose();
      }
      hideModal();
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        appear={true}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-center my-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        appear={true}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className={`${transparentBg ? "" : "bg-white "}${
            shadow ? "shadow-lg " : ""
          }rounded-2xl overflow-auto max-h-full w-full${
            border ? " border-2 border-black border-opacity-25" : ""
          } font-poppins text-black ${maxSizeClass}`}
        >
          {showHeader ? (
            <div className={`${headerSeparator ? "p-6 border-b border-black border-opacity-10" : "pt-6 px-6"}`}>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-slate-800 mr-6">{title}</div>
                {titleBar ? titleBar : null}
                <button
                  className="ml-auto text-gray-200 hover:text-gray-300 active:text-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onClose) {
                      onClose();
                    }
                    hideModal();
                  }}
                >
                  <div className="sr-only">Close</div>
                  <svg className="w-4 h-4 fill-current">
                    <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
          {children}
        </div>
      </Transition>
    </>
  );
}

export default Modal;
