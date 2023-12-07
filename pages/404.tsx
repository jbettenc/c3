import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "../components/Navbar";
import PageNotFound from "../components/pages/PageNotFound";

const NotFoundPage = () => {
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
          <PageNotFound />
        </div>
      </main>
    </>
  );
};

export default NotFoundPage;
