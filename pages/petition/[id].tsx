import Navbar from "@/components/Navbar";
import Petition from "@/components/Petition";
import Head from "next/head";
import { useRouter } from "next/router";

function PetitionPage() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>C3</title>
      </Head>
      <main className="w-full">
        <div className="h-16 bg-white">
          <Navbar fixed={true} />
        </div>
        <Petition />
      </main>
    </>
  );
}

export default PetitionPage;
