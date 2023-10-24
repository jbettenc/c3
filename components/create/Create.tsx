import Image from "next/image";
import Card from "../Card";
import Radio from "@/ui/forms/Radio";
import Input from "@/ui/forms/Input";
import Button from "@/ui/forms/Button";
import { useEffect, useState } from "react";
import CheckIcon from "../../assets/check.svg";
import FileDropzone from "../FileDropzone";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useWeb3React } from "@web3-react/core";
import { MODAL_TYPE, useGlobalModalContext } from "../context/ModalContext";
import { postUploadToStorage } from "@/utils/storage";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { Contract } from "ethers";
import C3ABI from "../../artifacts/C3.json";
import { getBase64, getProviderUrl, storeNotif } from "@/utils/misc";
import { AbiCoder } from "ethers";
import { StoragePayload } from "@/types";
import { BackArrowIcon } from "../icons/BackArrowIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useENS } from "@/utils/hooks/useENS";
import { CONTRACT_ADDRESS, DEFAULT_CHAIN_ID } from "@/constants/constants";

export function Create() {
  const [title, handleTitle] = useState("");
  const [description, handleDescription] = useState("");
  const [step, handleStep] = useState(0);
  const [importState, handleImportState] = useState<File[]>([]);
  const [metadata, handleMetadata] = useState<any>();
  const [hash, handleHash] = useState<string>();
  const { active, account, library } = useWeb3React();
  const { showModal, hideModal } = useGlobalModalContext();
  const router = useRouter();
  const { alias } = useENS(account ?? "");

  useEffect(() => {
    if (!hash) {
      handleHash(ethers.hashMessage(uuidv4()));
    }
  }, [hash]);

  useEffect(() => {
    if (!hash || !account) {
      return;
    }
    if (!metadata) {
      showModal(
        MODAL_TYPE.WORLD_ID_VERIFY,
        {
          idkitButton: (
            <IDKitWidget
              app_id="app_staging_6ec3ea829a0d16fa66a44e9872b70153"
              action={`createPetition-${hash}`} // or signPetition
              signal={account ?? ""}
              handleVerify={async (e: {
                merkle_root: string;
                nullifier_hash: string;
                proof: string;
                credential_type: CredentialType;
              }) => {
                // TODO: Remove this console log
                console.log(e);
                // Only perform backend check if the credential type is phone. Orb performed on chain.
                if (e.credential_type === CredentialType.Phone) {
                  throw new Error("Only Orb Verified accounts can start a petition.");
                }
              }}
              onSuccess={async (e: {
                merkle_root: string;
                nullifier_hash: string;
                proof: string;
                credential_type: string;
              }) => {
                const proof = [...[...AbiCoder.defaultAbiCoder().decode(["uint256[8]"], e.proof)][0]];
                const md = {
                  root: e.merkle_root,
                  nullifierHash: e.nullifier_hash,
                  proof: proof
                };
                handleMetadata(md);
              }}
              enableTelemetry
            >
              {({ open }) => (
                <Button
                  className="w-full sm:w-[49%]"
                  onClick={async () => {
                    open();
                  }}
                >
                  Sign In with WorldCoin
                </Button>
              )}
            </IDKitWidget>
          )
        },
        { showHeader: false, border: false, hideOnPathnameChange: true, preventModalClose: true }
      );
    } else {
      hideModal(true);
    }
  }, [metadata, hash, account]);

  if (step < 2) {
    return (
      <>
        <div className="flex flex-col text-black w-full mb-16">
          <div className="w-full border-b border-gray-300">
            <div className="mx-6">
              <div className="flex flex-col mx-auto max-w-7xl w-full my-2">
                <div className="font-semibold text-lg">Start a petition</div>
                <div>Start your petition</div>
              </div>
            </div>
          </div>
          <div className="my-4 max-w-5xl mx-auto w-full flex flex-col gap-4 p-6">
            <Card
              expanded={step === 0}
              header={
                <>
                  <div className="flex flex-row">
                    <div className="my-auto mr-4">
                      {step === 0 ? (
                        <Radio checked groupName="N/A" />
                      ) : (
                        <Image src={CheckIcon} alt="Complete" className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg">Add Petition Details</div>
                      <div>Start your petition by adding title and details</div>
                    </div>
                    {step !== 0 ? (
                      <>
                        <Button
                          className="text-primary-700 ml-auto"
                          filled={false}
                          onClick={() => handleStep(0)}
                          shadow={false}
                        >
                          Edit
                        </Button>
                      </>
                    ) : null}
                  </div>
                </>
              }
              body={
                <>
                  <div className="flex flex-col my-4 mx-6">
                    <div className="flex flex-col mb-3">
                      <div>Petition Title</div>
                      <Input
                        placeholder="What is this petition about?"
                        value={title}
                        onChange={(e) => handleTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col mb-3">
                      <div>Petition Message</div>
                      <Input
                        placeholder="Provide more details about your petition. Why does it matter?"
                        multiline={true}
                        value={description}
                        onChange={(e) => handleDescription(e.target.value)}
                      />
                    </div>
                    <div className="mr-auto">
                      <Button
                        disabled={
                          !title || title.trim().length === 0 || !description || description.trim().length === 0
                        }
                        onClick={() => handleStep(1)}
                      >
                        Add Images
                      </Button>
                    </div>
                  </div>
                </>
              }
            />
            <Card
              expanded={step === 1}
              header={
                <>
                  <div className="flex flex-row">
                    <div className="my-auto mr-4">
                      {<Radio checked={step === 1} groupName="N/A2" disabled={step === 0} />}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg">Add Images</div>
                      <div>Add supporting images to your petition</div>
                    </div>
                    {step > 1 ? (
                      <>
                        <Button
                          className="text-primary-700 ml-auto"
                          filled={false}
                          onClick={() => handleStep(0)}
                          shadow={false}
                        >
                          Edit
                        </Button>
                      </>
                    ) : null}
                  </div>
                </>
              }
              body={
                <>
                  <FileDropzone
                    importState={importState}
                    handleImportState={(state) => {
                      handleImportState(state);
                    }}
                  />
                </>
              }
            />
          </div>
        </div>

        <div className="h-16 bg-white text-black fixed bottom-0 w-full shadow-bg-blur">
          <div className="flex w-full h-full px-6">
            <Link href="/" className="my-auto">
              <Button
                style="secondary"
                icon={<BackArrowIcon className="w-3 h-3" />}
                onClick={(e) => {
                  if (step > 0) {
                    handleStep(step - 1);
                    e.stopPropagation();
                    e.preventDefault();
                  }
                }}
              >
                Back
              </Button>
            </Link>
            <Button
              className="my-auto ml-auto"
              disabled={
                step === 0 && (!title || title.trim().length === 0 || !description || description.trim().length === 0)
              }
              onClick={() => handleStep(step + 1)}
            >
              {step === 0 ? "Next" : "Preview Petition"}
            </Button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col text-black w-full mb-16">
        <div className="w-full border-b border-gray-300">
          <div className="mx-6">
            <div className="flex flex-col mx-auto max-w-7xl w-full my-2">
              <div className="font-semibold text-lg">Preview Petition</div>
              <div>Preview your petition before sending it out</div>
            </div>
          </div>
        </div>
        <div className="my-4 w-full px-6">
          <div className="max-w-5xl mx-auto w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
            <div className="font-semibold font-lg">{title}</div>
            <div>{description}</div>
            {importState.length > 0 ? (
              <div className="w-full">
                <Carousel dynamicHeight={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                  {importState.map((file, idx) => (
                    <div className="" key={`landingimportstate-${idx}`}>
                      <img className="w-full h-auto" src={URL.createObjectURL(file)} alt="Image" />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : null}
            <div className="font-medium">
              Initiated by:{" "}
              {alias && account
                ? alias + ` (${account.substring(0, 6) + "..." + account.substring(account.length - 4)})`
                : account
                ? account.substring(0, 6) + "..." + account.substring(account.length - 4)
                : "--"}
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 bg-white text-black fixed bottom-0 w-full">
        <div className="flex w-full h-full px-6">
          <Button className="my-auto" style="secondary" disabled={step === 0} onClick={() => handleStep(step - 1)}>
            Back
          </Button>

          <Button
            className="my-auto ml-auto"
            disabled={
              step === 0 && (!title || title.trim().length === 0 || !description || description.trim().length === 0)
            }
            onClick={async () => {
              if (step === 2) {
                const tags = [{ name: "Application", value: "EthSignC3" }];
                // prepare message to sign before upload
                let payload = {
                  address: account,
                  title,
                  description,
                  images: await Promise.all(importState.map(async (f) => await getBase64(f)))
                };

                const messagePayload = {
                  address: account,
                  timestamp: new Date().toISOString(),
                  version: "4.1",
                  hash: ethers.hashMessage(
                    JSON.stringify({
                      data: payload
                    })
                  )
                };

                // messages converted to string before sign with statement prefix
                const message = `EthSign is requesting your signature to validate the data being uploaded. This action does not incur any gas fees.\n\n~\n\n${JSON.stringify(
                  messagePayload,
                  null,
                  2
                )}`;

                // sign signature with the messages in details
                const signature = await library.provider.request({
                  method: "personal_sign",
                  params: [message, account]
                });

                // payload to upload arweave storage
                const storagePayload: StoragePayload = {
                  signature,
                  message,
                  data: JSON.stringify({
                    data: payload
                  }),
                  tags,
                  shouldVerify: true
                };

                // Upload to our Arweave endpoint
                const storage = await postUploadToStorage(storagePayload);
                if (!storage?.message || storage.message !== "success") {
                  storeNotif("Error", "Failed to upload petition metadata to Arweave. Please try again.", "danger");
                  return;
                }
                const cid = storage.transaction.itemId ?? "";

                // Trigger smart contract call
                const provider = new ethers.JsonRpcProvider(await getProviderUrl(library));
                const contract = new Contract(
                  CONTRACT_ADDRESS(
                    active ? (await library.getNetwork()).chainId ?? DEFAULT_CHAIN_ID : DEFAULT_CHAIN_ID
                  ),
                  C3ABI.abi,
                  provider
                );
                const instance = contract.connect(library.getSigner()) as Contract;
                try {
                  await instance.createPetition(hash, cid, metadata);
                  showModal(
                    MODAL_TYPE.SHARE,
                    { url: `${window.location.href.replace("create", "petition")}/${hash}` },
                    {
                      title: "Share Petition",
                      headerSeparator: false,
                      border: false,
                      onClose: () => router.push(`/petition/${hash}`)
                    }
                  );
                } catch (err: any) {
                  storeNotif("Error", err?.message ? err.message : err, "danger");
                }
              } else {
                handleStep(step + 1);
              }
            }}
          >
            {step === 0 ? "Next" : step === 1 ? "Preview Petition" : "Create and Share"}
          </Button>
        </div>
      </div>
    </>
  );
}
