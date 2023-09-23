import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect } from "react";
import { WALLET_CONNECT, COINBASE, METAMASK, TORUS } from "../../utils/web3/providers";
import { Provider as ProviderType } from "../../types";
import { guidGenerator, storeNotif } from "../../utils/misc";

interface ProviderProps {
  name: string;
  logos: any;
  description: string | undefined;
  onClick: (e?: any) => void;
  [key: string]: any;
}

interface WalletSelectProps {
  handleLoginType: (e?: any) => void;
  onClose: (e?: any) => void;
  [key: string]: any;
}

const Provider = (props: ProviderProps) => {
  const { name, logos, description, onClick } = props;

  const renderLogo = useCallback(
    (Logo: any, idx: number) => (
      <Logo key={`connect-${name}-logo-${idx}`} className="flex-shrink-0 xs:w-[30px] md:w-8 xs:h-[30px] md:h-8" />
    ),
    []
  );

  return (
    <>
      <div
        className={`bg-white w-full p-6 gap-4 flex flex-wrap sm:flex-nowrap justify-center items-center rounded-lg cursor-pointer border-2 border-opacity-40 border-black hover:bg-gray-21 active:bg-gray-23`}
        onClick={onClick}
      >
        <span className="whitespace-nowrap leading-none text-center sm:text-start truncate">
          <span className="block text-base text-black text-opacity-80 font-medium leading-none">{name}</span>
          <span className={`w-full text-xs mx-0 leading-none text-black mt-2 sm:mt-0 text-opacity-40 font-normal`}>
            {description}
          </span>
        </span>
        <span className="flex items-center space-x-6">{logos?.map(renderLogo)}</span>
      </div>
    </>
  );
};

const Divider = () => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
      <div className="h-0.5 w-full bg-black bg-opacity-10"></div>
      <span className="text-sm font-medium text-black text-opacity-80">or continue with</span>
      <div className="h-0.5 w-full bg-black bg-opacity-10"></div>
    </div>
  );
};

const WalletSelect = (props: WalletSelectProps) => {
  const { handleLoginType, onClose, open } = props;
  const { activate, active } = useWeb3React();

  useEffect(() => {
    if (active) {
      if (onClose) {
        onClose();
      }
    }
  }, [active, onClose]);

  const providers = [METAMASK, WALLET_CONNECT, COINBASE, undefined, TORUS];

  const renderProvider = useCallback(
    (provider: ProviderType | undefined) =>
      provider ? (
        <Provider
          key={`${provider.id}-${provider.name}`}
          name={provider.name}
          logos={provider.logos}
          description={provider.description}
          onClick={() => {
            activate(
              provider.connector,
              (e: Error) => {
                if (e.message !== "Call init() first") {
                  storeNotif("Wallet Connection Error", "", "danger");
                }
              },
              false
            );
            handleLoginType(provider.id);
          }}
        />
      ) : (
        <Divider key={guidGenerator()} />
      ),
    [handleLoginType, activate]
  );

  return (
    <div
      className={`overflow-auto max-h-full relative w-[calc(100%-2rem)] bg-blue-200 border-2 border-black border-opacity-80 rounded-lg m-3 mr-4 mb-6 xs:mx-auto p-6 overflow-auto xs:w-[410px] space-y-6`}
    >
      {providers.map(renderProvider)}
    </div>
  );
};

export default WalletSelect;
