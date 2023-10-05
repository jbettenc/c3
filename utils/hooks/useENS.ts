import { setENSState, setENSMutex } from "@/store/ensSlice";
import { RootState } from "@/store/root";
import { Mutex } from "async-mutex";
import { JsonRpcProvider } from "ethers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function useENS(address?: string) {
  const [alias, handleAlias] = useState<any>();
  const [avatar, handleAvatar] = useState<any>();

  const { ensState, ensMutex } = useSelector((state: RootState) => state.ens);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address || avatar || alias) {
      return;
    }

    (async () => {
      const addr = address.toLowerCase();
      // Read operation does not need mutex on first pass
      if (ensState && ensState[addr]) {
        handleAlias(ensState[addr].alias);
        handleAvatar(ensState[addr].avatar);
        return;
      }

      // If we haven't found the alias/avatar yet, need mutex

      // Create mutex if not exists. Then return, because ensMutex needs to update before we can proceed.
      if (!ensMutex || !ensMutex[addr]) {
        dispatch(setENSMutex({ [addr]: new Mutex() }));
        return;
      }
      // Aquire the mutex. If it is already locked, start over with a new value of ensState.
      if (ensMutex[addr].isLocked()) {
        return;
      }

      const release = await ensMutex[addr].acquire();

      // Now that we have the mutex, check if another hook updated the alias/avatar already
      if (ensState && ensState[addr]) {
        handleAlias(ensState[addr].alias);
        handleAvatar(ensState[addr].avatar);
        release();
        return;
      }

      // Load the alias/avatar for the current user on mainnet
      try {
        // Mainnet provider
        const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/udrqNPSB6i5n5L6QSM31Ng72h_hFOrVT");
        const alias = await provider.lookupAddress(addr);
        handleAlias(alias);
        const resolver = await provider.getResolver(alias ?? "");
        if (resolver) {
          const avatar = await resolver.getText("avatar");
          handleAvatar(avatar);
        }
        if (alias || avatar) {
          dispatch(setENSState({ [addr]: { avatar: avatar ?? null, alias: alias ?? null, timestamp: Date.now() } }));
        }
      } catch (err) {
        console.log(err);
      } finally {
        release();
      }
    })();
  }, [address, ensMutex, ensState]);

  return {
    alias,
    avatar
  };
}
