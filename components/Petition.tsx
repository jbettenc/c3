import Button from "@/ui/forms/Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import IdentIcon from "./common/IdentIcon";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root";
import { bytesToString, copyStringToClipboard, fromHexString, getProviderUrl, storeNotif } from "@/utils/misc";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { getFileForUser, getObj } from "@/utils/storage";
import { loadPetitionSigners } from "@/utils/queries";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { ethers } from "ethers";
import { Contract } from "ethers";
import C3ABI from "../artifacts/C3.json";
import { AbiCoder } from "ethers";
import { MODAL_TYPE, useGlobalModalContext } from "./context/ModalContext";
import { IPetition, IPetitionMetadata } from "@/types";
import SignerCard from "./SignerCard";
import Link from "next/link";
import { BackArrowIcon } from "./icons/BackArrowIcon";
import { ETHSIGN_PETITION_API_URL } from "@/constants/constants";

interface PetitionProps {
  petition?: IPetition;
  metadata?: IPetitionMetadata;
  creatorAlias?: string;
}

function Petition(props: PetitionProps) {
  const { petition, metadata, creatorAlias } = props;
  const [testVal, handleTestVal] = useState("asdf");
  const [signers, handleSigners] = useState<any>([]);
  const { account, library } = useWeb3React();
  const { showModal } = useGlobalModalContext();

  useEffect(() => {
    (async () => {
      if (petition?.cid) {
        const signers = await loadPetitionSigners(petition.id);
        handleSigners(signers ?? undefined);
      } else {
        // storeNotif("Error", "Cannot locate petition.", "danger");
      }
    })();
  }, [petition]);

  return (
    <>
      <div className="flex text-black w-full mb-16 px-6">
        <div className="mt-4 flex-col sm:flex-row flex max-w-7xl mx-auto w-full gap-4">
          <div className="flex flex-col max-w-5xl w-full gap-4">
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div className="font-semibold text-lg">{metadata?.title}</div>
              <div>{metadata?.description}</div>
              {metadata?.images?.length && metadata.images.length > 0 ? (
                <div className="w-full">
                  <Carousel dynamicHeight={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                    {metadata.images.map((file, idx) => (
                      <div className="" key={`ipfsimages-${idx}`}>
                        <img className="w-full h-auto" src={file} alt="Image" />
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : null}
              <div className="font-medium">
                Initiated by:{" "}
                {creatorAlias
                  ? creatorAlias +
                    ` (${
                      petition?.petitioner.substring(0, 6) +
                      "..." +
                      petition?.petitioner.substring(petition.petitioner.length - 4)
                    })`
                  : petition?.petitioner.substring(0, 6) +
                    "..." +
                    petition?.petitioner.substring(petition.petitioner.length - 4)}
              </div>
            </div>
          </div>
          <div className="flex flex-col max-w-lg w-full mb-4 sm:mb-0">
            <SignerCard petition={petition} signers={signers} />
          </div>
        </div>
      </div>
      <div className="h-16 bg-white text-black fixed bottom-0 w-full z-5 shadow-bg-blur">
        <div className="flex w-full h-full px-6">
          <Link href="/" className="my-auto">
            <Button style="secondary" icon={<BackArrowIcon className="w-3 h-3" />}>
              Back
            </Button>
          </Link>
          <Button
            className="my-auto ml-auto"
            onClick={() => {
              showModal(
                MODAL_TYPE.SIGN_PETITION,
                { petition: petition },
                { showHeader: false, border: false, hideOnPathnameChange: true }
              );
            }}
          >
            Sign
          </Button>
          <Button
            className="my-auto ml-2"
            style="secondary"
            onClick={() => {
              showModal(
                MODAL_TYPE.SHARE,
                {
                  url: window.location.href,
                  title: metadata?.title,
                  creator: creatorAlias
                    ? creatorAlias +
                      ` (${
                        petition?.petitioner.substring(0, 6) +
                        "..." +
                        petition?.petitioner.substring(petition.petitioner.length - 4)
                      })`
                    : petition?.petitioner.substring(0, 6) +
                      "..." +
                      petition?.petitioner.substring(petition.petitioner.length - 4),
                  images: metadata?.images
                },
                { title: "Share Petition", headerSeparator: false, border: false }
              );
            }}
          >
            Share
          </Button>
        </div>
      </div>
    </>
  );
}

export default Petition;
