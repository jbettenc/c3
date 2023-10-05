import Navbar from "@/components/Navbar";
import { Create as CreateComponent } from "@/components/create/Create";
import { setEthAlias, setEthAvatar } from "@/store/userSlice";
import { useENS } from "@/utils/hooks/useENS";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Create() {
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const { alias, avatar } = useENS(account ?? undefined);

  useEffect(() => {
    dispatch(setEthAlias(alias));
    dispatch(setEthAvatar(avatar));
  }, [alias, avatar, dispatch]);

  return (
    <>
      <Head>
        <title>C3</title>
      </Head>
      <main className="w-full bg-white">
        <div className="h-16">
          <Navbar fixed={true} />
        </div>
        <CreateComponent />
      </main>
    </>
  );
}
