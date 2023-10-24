import { useEffect, useState } from "react";
import { IPetition, IPetitionMetadata } from "@/types";
import { getFileForUser } from "@/utils/storage";
import ImageCard from "./layouts/ImageCard";
import { useRouter } from "next/router";
import TitleCard from "./layouts/TitleCard";

interface CardLoaderProps {
  petition: IPetition;
}

function CardLoader(props: CardLoaderProps) {
  const [metadata, handleMetadata] = useState<IPetitionMetadata | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      let metadata: IPetitionMetadata | null = null;

      try {
        if (props.petition.cid) {
          const obj = await getFileForUser(props.petition.cid);
          metadata = obj?.data ?? null;
        }
      } catch (err) {}

      handleMetadata(metadata);
    })();
  }, [props.petition]);

  if (!metadata) {
    return null;
  }

  if (metadata.images.length > 0) {
    return (
      <ImageCard
        image={metadata.images[0]}
        title={metadata.title}
        petitioner={props.petition.petitioner}
        signatures={props.petition.signatures}
        onClick={() => router.push(`/petition/${props.petition.id}`)}
      />
    );
  } else {
    return (
      <TitleCard
        title={metadata.title}
        petitioner={props.petition.petitioner}
        signatures={props.petition.signatures}
        onClick={() => router.push(`/petition/${props.petition.id}`)}
      />
    );
  }

  return <></>;
}

export default CardLoader;