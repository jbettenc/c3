import { useEffect, useState } from "react";
import IdentIcon from "./common/IdentIcon";
import Image from "next/image";
import { JsonRpcProvider } from "ethers";

interface SignerProps {
  address?: string;
}

function Signer(props: SignerProps) {
  const [alias, handleAlias] = useState<any>();
  const [avatar, handleAvatar] = useState<any>();
  useEffect(() => {
    if (!props.address) {
      return;
    }

    (async () => {
      const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/udrqNPSB6i5n5L6QSM31Ng72h_hFOrVT");
      const alias = await provider.lookupAddress(props.address ?? "");
      handleAlias(alias);
      const resolver = await provider.getResolver(alias ?? "");
      if (resolver) {
        const avatar = await resolver.getText("avatar");
        handleAvatar(avatar);
      }
    })();
  }, [props.address]);
  return (
    <>
      <div className="flex">
        <div className="my-auto">
          {avatar ? (
            <Image className="w-9 h-9 rounded-full object-cover" src={avatar} alt="" />
          ) : (
            <div className="p-2">
              <IdentIcon
                string={props.address}
                size={17}
                palette={["#FFC32A", "#AEDFFB", "#6C66E9", "#FFDB80", "#CDCDCD", "#000000", "#C9AEFB", "#B9E5D4"]}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {alias ? <div className="font-semibold">{alias}</div> : null}
          <div>
            {props.address
              ? props.address.substring(0, 6) + "..." + props.address.substring(props.address.length - 6)
              : "--"}
          </div>
        </div>
      </div>
    </>
  );
}

export default Signer;
