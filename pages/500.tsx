import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import PageError from "@/components/pages/PageError";

const InternalServerErrorPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>DEAL</title>
      </Head>
      <main className="w-full">
        <div className="absolute h-16">
          <Navbar fixed={true} transparent />
        </div>
        <div className="w-full flex justify-around items-center h-full py-16">
          <PageError />
        </div>
      </main>
    </>
  );
};

export default InternalServerErrorPage;
