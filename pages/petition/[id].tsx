import Navbar from "@/components/Navbar";
import Petition from "@/components/Petition";
import { stringToBytesString } from "@/utils/misc";
import { loadPetition } from "@/utils/queries";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
function PetitionPage() {
  const [petition, handlePetition] = useState<{
    id: string;
    cid: string;
    petitioner: string;
    signatures: number;
    timestamp: string;
  }>();

  const router = useRouter();

  useEffect(() => {
    const id = router.query.id;
    if (!id) {
      return;
    }

    const arr = "0x" + stringToBytesString((id as string) ?? "");

    (async () => {
      handlePetition(await loadPetition(arr));
    })();
  }, [router]);

  return (
    <>
      <Head>
        <title>C3</title>
      </Head>
      <main className="w-full">
        <div className="h-16 bg-white">
          <Navbar fixed={true} />
        </div>
        <Petition petition={petition} />
      </main>
    </>
  );
}

export default PetitionPage;
