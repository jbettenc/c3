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
import { ethers, Contract } from "ethers";
import { v4 as uuidv4 } from "uuid";
import C3ABI from "../../artifacts/C3.json";
import { getBase64, getProviderUrl, storeNotif } from "@/utils/misc";
import { StoragePayload } from "@/types";
import { BackArrowIcon } from "../icons/BackArrowIcon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useENS } from "@/utils/hooks/useENS";
import { CONTRACT_ADDRESS, DEFAULT_CHAIN_ID } from "@/constants/constants";
import { getLibrary } from "@/web3/utils";
import { defaultAbiCoder } from "ethers/lib/utils";
import { CredentialType } from "@worldcoin/idkit";

export function Create() {
  const [title, handleTitle] = useState("");
  const [description, handleDescription] = useState("");
  const [step, handleStep] = useState(0);
  const [creating, handleCreating] = useState(false);
  const [importState, handleImportState] = useState<File[]>([]);
  const [credentialType, handleCredentialType] = useState<CredentialType>();
  const [metadata, handleMetadata] = useState<any>();
  const [hash, handleHash] = useState<string>();
  const { account, chainId, connector } = useWeb3React();
  const { showModal, hideModal } = useGlobalModalContext();
  const router = useRouter();
  const { alias } = useENS(account ?? "");

  useEffect(() => {
    if (!hash) {
      handleHash(ethers.utils.hashMessage(uuidv4()));
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
          hash,
          onSuccess: async (e: {
            merkle_root: string;
            nullifier_hash: string;
            proof: string;
            credential_type: CredentialType;
          }) => {
            const proof = [...[...defaultAbiCoder.decode(["uint256[8]"], e.proof)][0]];
            const md = {
              root: e.merkle_root,
              nullifierHash: e.nullifier_hash,
              proof: proof
            };
            handleCredentialType(e.credential_type);
            handleMetadata(md);
          }
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
            loading={creating}
            className="my-auto ml-auto"
            disabled={
              step === 0 && (!title || title.trim().length === 0 || !description || description.trim().length === 0)
            }
            onClick={async () => {
              if (step === 2) {
                if (!connector.provider) {
                  storeNotif("Error", "No wallet connected.", "danger");
                  return;
                }

                handleCreating(true);
                const tags = [{ name: "Application", value: "EthSignC3" }];
                const images = await Promise.all(importState.map(async (f) => await getBase64(f)));
                // prepare message to sign before upload
                let payload = {
                  address: account,
                  title,
                  description,
                  images
                };

                const messagePayload = {
                  address: account,
                  timestamp: new Date().toISOString(),
                  version: "4.1",
                  hash: ethers.utils.hashMessage(
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
                const signature = (await connector.provider.request({
                  method: "personal_sign",
                  params: [message, account]
                })) as string;

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
                  handleCreating(false);
                  return;
                }
                const cid = storage.transaction.itemId ?? "";

                if (credentialType === CredentialType.Orb) {
                  // Trigger smart contract call
                  const provider = new ethers.providers.JsonRpcProvider(
                    await getProviderUrl(chainId ?? DEFAULT_CHAIN_ID)
                  );
                  const contract = new Contract(CONTRACT_ADDRESS(chainId ?? DEFAULT_CHAIN_ID), C3ABI.abi, provider);
                  const library = getLibrary(connector.provider);
                  const instance = contract.connect(library.getSigner() as any) as Contract;
                  try {
                    await instance.createPetition(hash, cid, metadata).then(
                      async (tx: any) =>
                        await tx.wait(1).then(() => {
                          showModal(
                            MODAL_TYPE.SHARE,
                            {
                              url: `${window.location.href.replace("create", "petition")}/${hash}`,
                              title,
                              address: account,
                              images
                            },
                            {
                              title: "Share Petition",
                              headerSeparator: false,
                              border: false,
                              onClose: () => router.push(`/petition/${hash}`)
                            }
                          );
                        })
                    );
                  } catch (err: any) {
                    storeNotif("Error", err?.message ? err.message : err, "danger");
                  }
                } else {
                  try {
                    // TODO: call backend to create off-chain petition
                    // I have hash, cid, metadata, petitioner/account to send to backend

                    showModal(
                      MODAL_TYPE.SHARE,
                      {
                        url: `${window.location.href.replace("create", "petition")}/${hash}`,
                        title,
                        address: account,
                        images
                      },
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
                }
              } else {
                handleStep(step + 1);
              }
              handleCreating(false);
            }}
          >
            {step === 0 ? "Next" : step === 1 ? "Preview Petition" : "Create and Share"}
          </Button>
        </div>
      </div>
    </>
  );
}
