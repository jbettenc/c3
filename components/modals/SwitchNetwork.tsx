import Button from "@/ui/forms/Button";
import { WarningIcon } from "../icons/WarningIcon";

interface SwitchNetworkProps {
  switchChain: () => void;
}

function SwitchNetwork(props: SwitchNetworkProps) {
  const { switchChain } = props;
  return (
    <>
      <div className="flex flex-col p-8 gap-4">
        <WarningIcon className="mx-auto" />
        <div className="text-lg font-medium text-center">Wrong Network Detected</div>
        <div className="text-sm text-center">
          It looks like your wallet is not connected to the correct network. Please switch networks.
        </div>
        <Button
          filled={false}
          shadow={false}
          onClick={() => {
            switchChain && switchChain();
          }}
        >
          Switch to Polygon Testnet
        </Button>
      </div>
    </>
  );
}

export default SwitchNetwork;
