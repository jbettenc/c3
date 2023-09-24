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
import { getObj } from "@/utils/storage";
import { loadPetitionSigners } from "@/utils/queries";
import { IDKitWidget } from "@worldcoin/idkit";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { Contract } from "ethers";
import C3ABI from "../artifacts/C3.json";
import { AbiCoder } from "ethers";
import { MODAL_TYPE, useGlobalModalContext } from "./context/ModalContext";
import Signer from "./Signer";

interface PetitionProps {
  petition?: {
    id: string;
    cid: string;
    petitioner: string;
    signatures: number;
    timestamp: string;
  };
}

function Petition(props: PetitionProps) {
  const { petition } = props;
  const [ipfs, handleIpfs] = useState<{
    address: string;
    title: string;
    description: string;
    images: string[];
  }>();
  const [signers, handleSigners] = useState<any>([]);
  const GOAL = 100;
  const { ethAvatar } = useSelector((state: RootState) => state.user);
  const { account, library } = useWeb3React();
  const [hash, handleHash] = useState("");
  const { showModal } = useGlobalModalContext();

  useEffect(() => {
    handleHash(ethers.hashMessage(uuidv4()));
  }, []);

  useEffect(() => {
    (async () => {
      if (petition?.cid) {
        const obj = await getObj(bytesToString(fromHexString(petition.cid.substring(2))));
        handleIpfs(obj?.data ?? undefined);
        console.log(obj);

        const obj2 = await loadPetitionSigners(petition.id);
        handleSigners(obj2 ?? undefined);
      }
    })();
  }, [petition]);

  return (
    <>
      <div className="flex text-black w-full mb-16 px-4">
        <div className="mt-4 flex max-w-7xl mx-auto w-full gap-4">
          <div className="flex flex-col max-w-5xl w-full gap-4">
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div className="font-semibold text-lg">{ipfs?.title}</div>
              <div>{petition?.petitioner}</div>
            </div>
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div>{ipfs?.description}</div>
              {ipfs?.images?.length && ipfs.images.length > 0 ? (
                <div className="w-full">
                  <Carousel dynamicHeight={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                    {ipfs.images.map((file) => (
                      <div className="">
                        <img className="w-full h-auto" src={file} alt="Image" />
                      </div>
                    ))}
                  </Carousel>
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col max-w-lg w-full">
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div className="flex">
                <div className="font-lg font-semibold mr-2">Signers</div>
                <div className="bg-orange-50 text-orange-700 rounded-full px-3 text-sm my-auto">
                  {petition?.signatures ?? 0} signatures
                </div>
              </div>
              <div className="flex">
                <div className="my-auto mr-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-600 h-2.5 rounded-full"
                    style={{ width: `${petition?.signatures ?? 0 / GOAL}%` }}
                  ></div>
                </div>
                <div className="whitespace-nowrap">Goal: {GOAL}</div>
              </div>
              <table>
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="py-2 pl-4">
                      <div className="text-left">Name</div>
                    </th>
                    <th className="py-2 pr-4">
                      <div className="text-left">Sign Date</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {signers
                    ? signers.map((signer: any) => (
                        <tr>
                          <td className="pl-4 py-2">
                            <Signer address={signer.signer} />
                          </td>
                          <td className="pr-4 py-2">{new Date(signer.timestamp * 1000).toDateString()}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="h-16 bg-white text-black fixed bottom-0 w-full">
        <div className="flex w-full h-full px-6">
          {/* <Button className="my-auto" style="secondary">
            Back
          </Button> */}
          <IDKitWidget
            app_id="app_staging_6ec3ea829a0d16fa66a44e9872b70153"
            action={`signPetition-${bytesToString(fromHexString(petition?.id.substring(2) ?? "0x00") ?? "")}`}
            signal={account ?? ""}
            onSuccess={async (e: {
              merkle_root: string;
              nullifier_hash: string;
              proof: string;
              credential_type: string;
            }) => {
              const provider = new ethers.JsonRpcProvider(await getProviderUrl(library));
              // This address is only for Base
              const contract = new Contract("0x36e3f7a8C88EE63740b50f7b87c069a74e461f85", C3ABI.abi, provider);
              const instance = contract.connect(library.getSigner()) as Contract;
              const proof = [...[...AbiCoder.defaultAbiCoder().decode(["uint256[8]"], e.proof)][0]];
              const metadata = {
                root: e.merkle_root,
                nullifierHash: e.nullifier_hash,
                proof: proof
              };
              try {
                await instance.signPetition(
                  bytesToString(fromHexString(petition?.id.substring(2) ?? "") ?? ""),
                  metadata
                );
                storeNotif("Success", "Petition signed.", "success");
              } catch (err: any) {
                storeNotif("Error", err?.message ? err.message : err, "danger");
              }
            }}
            enableTelemetry
          >
            {({ open }) => (
              <Button
                className="my-auto ml-auto"
                onClick={() => {
                  open();
                }}
              >
                Sign Petition
              </Button>
            )}
          </IDKitWidget>
          <Button className="ml-2" style="secondary" onClick={() => copyStringToClipboard(window.location.href)}>
            Share Petition
          </Button>
        </div>
      </div>
    </>
  );
}

export default Petition;
