import Navbar from "@/components/Navbar";
import Petition from "@/components/Petition";
import { DEFAULT_CHAIN_ID } from "@/constants/constants";
import { IPetition, IPetitionMetadata } from "@/types";
import { useENS } from "@/utils/hooks/useENS";
import { splitPetitionId } from "@/utils/misc";
import { loadPetition } from "@/utils/queries";
import { getFileForUser, getSignaturesForPetition } from "@/utils/storage";
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

  const { alias: creatorAlias } = useENS(petition?.petitioner);

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
      <main className="w-full bg-white">
        <div className="h-16">
          <Navbar fixed={true} />
        </div>
        <div className="w-full border-b border-gray-300 text-black">
          <div className="mx-6">
            <div className="flex flex-col max-w-7xl w-full mx-auto my-2">
              <div className="font-semibold text-lg">Sign petition</div>
              <div>
                Sign the petition initiated by{" "}
                {creatorAlias
                  ? creatorAlias +
                    ` (${
                      petition?.petitioner.substring(0, 6) +
                      "..." +
                      petition?.petitioner.substring(petition.petitioner.length - 4)
                    })`
                  : petition?.petitioner
                  ? petition?.petitioner.substring(0, 6) +
                    "..." +
                    petition?.petitioner.substring(petition.petitioner.length - 4)
                  : "--"}
              </div>
            </div>
          </div>
        </div>
        <Petition petition={petition} metadata={metadata} creatorAlias={creatorAlias} />
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
    const arr = id as string;
    // TODO: We may need to pull petitions from different chains. Will need to modify URL to make this work.
    // Currently defaulting to polygon testnet for petition loading
    const { prefix } = splitPetitionId(arr);
    petition = await loadPetition(DEFAULT_CHAIN_ID, arr);

    if (prefix === "" && petition) {
      let lowerTierSignatures: any = await getSignaturesForPetition(arr);
      lowerTierSignatures = lowerTierSignatures?.data ?? {};
      petition = { ...petition, ...lowerTierSignatures };
    }

    if (petition?.cid) {
      const obj = await getFileForUser(petition.cid);
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
