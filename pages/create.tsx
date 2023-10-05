import Navbar from "@/components/Navbar";
import { Create as CreateComponent } from "@/components/create/Create";
import Head from "next/head";

export default function Create() {
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
