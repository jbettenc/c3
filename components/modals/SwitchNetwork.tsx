import Button from "@/ui/forms/Button";
import { WarningIcon } from "../icons/WarningIcon";

interface SwitchNetworkProps {}

function SwitchNetwork(props: SwitchNetworkProps) {
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
            const { ethereum } = window as any;
            ethereum &&
              ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                  {
                    chainId: "0x13881" // hex for polygon mumbai
                  }
                ]
              });
          }}
        >
          Switch to Polygon Testnet
        </Button>
      </div>
    </>
  );
}

export default SwitchNetwork;
