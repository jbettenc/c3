import { useEffect, useState } from "react";
import { IPetition, IPetitionMetadata } from "@/types";
import { getFileForUser } from "@/utils/storage";
import ImageCard from "./layouts/ImageCard";
import { useRouter } from "next/router";
import TitleCard from "./layouts/TitleCard";
import { MODAL_TYPE, useGlobalModalContext } from "../context/ModalContext";
import { splitPetitionId } from "@/utils/misc";

interface CardLoaderProps {
  petition: IPetition;
}

function CardLoader(props: CardLoaderProps) {
  const [metadata, handleMetadata] = useState<IPetitionMetadata | null>(null);

  const { showModal } = useGlobalModalContext();

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

  if (!metadata || metadata.images.length > 0) {
    return (
      <ImageCard
        loading={!metadata}
        prefix={splitPetitionId(props.petition.id).prefix}
        image={metadata ? metadata.images[0] : undefined}
        title={metadata ? metadata.title : ""}
        petitioner={props.petition.petitioner}
        tier0Signatures={props.petition.tier0Signatures}
        tier1Signatures={props.petition.tier1Signatures}
        tier2Signatures={props.petition.tier2Signatures}
        onClick={() => {
          showModal(MODAL_TYPE.LOADING, {}, { showHeader: false, preventModalClose: true }, true);
          router.push(`/petition/${props.petition.id}`);
        }}
      />
    );
  } else {
    return (
      <TitleCard
        title={metadata.title}
        prefix={splitPetitionId(props.petition.id).prefix}
        petitioner={props.petition.petitioner}
        tier0Signatures={props.petition.tier0Signatures}
        tier1Signatures={props.petition.tier1Signatures}
        tier2Signatures={props.petition.tier2Signatures}
        onClick={() => {
          showModal(MODAL_TYPE.LOADING, {}, { showHeader: false, preventModalClose: true }, true);
          router.push(`/petition/${props.petition.id}`);
        }}
      />
    );
  }

  return <></>;
}

export default CardLoader;
