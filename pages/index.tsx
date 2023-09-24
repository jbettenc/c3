import Navbar from "@/components/Navbar";
import Landing from "@/components/landing/Landing";
import { setEthAlias, setEthAvatar } from "@/store/userSlice";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcProvider } from "ethers";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const { account, library } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!!account && !!library) {
        try {
          const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/udrqNPSB6i5n5L6QSM31Ng72h_hFOrVT");
          const alias = await provider.lookupAddress(account);
          if (alias) {
            dispatch(setEthAlias(alias));

            const resolver = await provider.getResolver(alias);
            if (resolver) {
              const avatar = await resolver.getText("avatar");
              dispatch(setEthAvatar(avatar));
            }
          } else {
            dispatch(setEthAvatar(null));
            dispatch(setEthAlias(null));
          }
        } catch (err) {
          dispatch(setEthAvatar(null));
          dispatch(setEthAlias(null));
        }
      }
    })();
  }, [account, library]);

  return (
    <>
      <Head>
        <title>C3</title>
      </Head>
      <main className="w-full">
        <div className="h-16 bg-white">
          <Navbar fixed={true} />
        </div>
        <Landing />
      </main>
    </>
  );
}
