import { JsonRpcProvider } from "ethers";
import { useEffect, useState } from "react";

export function useENS(address?: string) {
  const [alias, handleAlias] = useState<any>();
  const [avatar, handleAvatar] = useState<any>();

  useEffect(() => {
    if (!address) {
      return;
    }

    (async () => {
      try {
        // Mainnet provider
        const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/udrqNPSB6i5n5L6QSM31Ng72h_hFOrVT");
        const alias = await provider.lookupAddress(address);
        handleAlias(alias);
        const resolver = await provider.getResolver(alias ?? "");
        if (resolver) {
          const avatar = await resolver.getText("avatar");
          handleAvatar(avatar);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [address]);

  return {
    alias,
    avatar
  };
}
