import Navbar from "@/components/Navbar";
import Landing from "@/components/landing/Landing";
import Head from "next/head";

export default function Home() {
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
