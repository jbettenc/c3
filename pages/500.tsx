import { useRouter } from "next/router";
import Head from "next/head";
import PageError from "@/components/pages/PageError";

const InternalServerErrorPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>DEAL</title>
      </Head>
      <main className="w-full">
        <div className="w-full flex justify-around items-center h-full">
          <PageError />
        </div>
      </main>
    </>
  );
};

export default InternalServerErrorPage;
