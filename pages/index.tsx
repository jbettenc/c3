import Navbar from "@/components/Navbar";
import Landing from "@/components/landing/Landing";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import { useDispatch } from "react-redux";

export default function Home() {
  const { account } = useWeb3React();
  const dispatch = useDispatch();

  return (
    <>
      <Head>
        <title>C3</title>
      </Head>
      <main className="w-full">
        <div className="h-16">
          <Navbar fixed={true} transparent />
        </div>
        <Landing />
      </main>
    </>
  );
}
