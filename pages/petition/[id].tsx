import Navbar from "@/components/Navbar";
import Petition from "@/components/Petition";
import { IPetition, IPetitionMetadata } from "@/types";
import { bytesToString, fromHexString, stringToBytesString } from "@/utils/misc";
import { loadPetition } from "@/utils/queries";
import { getFileForUser } from "@/utils/storage";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

interface PetitionPageProps {
  petition?: IPetition;
  metadata?: IPetitionMetadata;
  url: string | null;
}

function PetitionPage(props: PetitionPageProps) {
  const { petition, metadata } = props;

  const router = useRouter();

  // useEffect(() => {
  //   const id = router.query.id;
  //   if (!id) {
  //     return;
  //   }

  //   const arr = "0x" + stringToBytesString((id as string) ?? "");

  //   (async () => {
  //     handlePetition(await loadPetition(arr));
  //   })();
  // }, [router]);

  return (
    <>
      <NextSeo
        title={`${metadata?.title ? metadata.title + " | " : ""}C3`}
        openGraph={{
          url: props.url + router.asPath,
          title: `${metadata?.title ? metadata.title + " | " : ""}C3`,
          description: metadata?.description ?? "Communities Creating Change",
          images: metadata
            ? metadata.images.map((image) => ({
                url: image,
                width: 400,
                height: 400,
                alt: "Image"
              }))
            : [],
          siteName: "C3"
        }}
        twitter={{
          site: "@c3",
          cardType: "summary"
        }}
      />
      <main className="w-full">
        <div className="h-16 bg-white">
          <Navbar fixed={true} />
        </div>
        <Petition petition={petition} metadata={metadata} />
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query;

  if (!id) {
    return { props: {} };
  }

  let petition: IPetition | null = null;
  let metadata: IPetitionMetadata | null = null;

  try {
    const arr = "0x" + stringToBytesString((id as string) ?? "");
    petition = await loadPetition(arr);

    if (petition?.cid) {
      const obj = await getFileForUser(bytesToString(fromHexString(petition.cid.substring(2))));
      metadata = obj?.data ?? null;
    }
  } catch (err) {}

  if (petition && metadata) {
    // Data fresh for 10 seconds. Will still be served for 59 seconds, although the cached
    // value will be revalidated if requested after 10 seconds. Refreshed before served
    // if after 59 seconds.
    context.res.setHeader("Cache-Control", "public, s-maxage=10, stale-while-revalidate=59");
  }

  return {
    props: {
      petition,
      metadata,
      url: context.req.headers.host
    }
  };
}

export default PetitionPage;
