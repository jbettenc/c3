import Image from "next/image";
import Card from "../Card";
import Radio from "@/ui/forms/Radio";
import Input from "@/ui/forms/Input";
import Button from "@/ui/forms/Button";
import { useEffect, useState } from "react";
import CheckIcon from "../../assets/check.svg";
import FileDropzone from "../FileDropzone";
import { Carousel } from "react-responsive-carousel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useWeb3React } from "@web3-react/core";
import { MODAL_TYPE, useGlobalModalContext } from "../context/ModalContext";
import { postUploadToStorage, useWeb3Storage } from "@/utils/storage";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { IDKitWidget } from "@worldcoin/idkit";
import { Contract } from "ethers";
import C3ABI from "../../artifacts/C3.json";
import { getBase64, getProviderUrl, storeNotif } from "@/utils/misc";
import { AbiCoder } from "ethers";
import { StoragePayload } from "@/types";
import sha256 from "crypto-js/sha256";
import { enc } from "crypto-js";

function Landing() {
  const [title, handleTitle] = useState("");
  const [description, handleDescription] = useState("");
  const [step, handleStep] = useState(0);
  const [importState, handleImportState] = useState<File[]>([]);
  const [cid, handleCid] = useState("");
  const [hash, handleHash] = useState("");
  const { ethAlias, ethAvatar } = useSelector((state: RootState) => state.user);
  const { account, library } = useWeb3React();
  const { showModal } = useGlobalModalContext();
  const { storeObj } = useWeb3Storage();

  useEffect(() => {
    handleHash(ethers.hashMessage(uuidv4()));
  }, []);

  useEffect(() => {
    (async () => {
      console.log(await Promise.all(importState.map(async (f) => await getBase64(f))));
    })();
  }, [importState]);

  // useEffect(() => {
  //   if (step === 3) {
  //     showModal(MODAL_TYPE.SHARE, { url });
  //   }
  // }, [step]);

  if (step < 2) {
    return (
      <>
        <div className="flex flex-col text-black w-full mb-16">
          <div className="w-full border-b border-gray-300">
            <div className="flex flex-col mx-6 my-2">
              <div className="font-semibold text-lg">Start a petition</div>
              <div>Start your petition</div>
            </div>
          </div>
          <div className="my-4 max-w-5xl mx-auto w-full flex flex-col gap-4">
            <Card
              expanded={step === 0}
              header={
                <>
                  <div className="flex flex-row">
                    <div className="my-auto mr-4">
                      {step === 0 ? <Radio checked groupName="N/A" /> : <Image src={CheckIcon} alt="Complete" />}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold text-lg">Add Petition Details</div>
                      <div>Start your petition by adding title and details</div>
                    </div>
                    {step !== 0 ? (
                      <>
                        <Button
                          className="text-orange-500 ml-auto"
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
                          className="text-orange-500 ml-auto"
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
          <div className="flex flex-col mx-6 my-2">
            <div className="font-semibold text-lg">Preview Petition</div>
            <div>Preview your petition before sending it out</div>
          </div>
        </div>
        <div className="my-4 max-w-5xl mx-auto w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
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
          <div>Initiated by {ethAlias ? ethAlias : account}</div>
        </div>
      </div>

      <div className="h-16 bg-white text-black fixed bottom-0 w-full">
        <div className="flex w-full h-full px-6">
          <Button className="my-auto" style="secondary" disabled={step === 0} onClick={() => handleStep(step - 1)}>
            Back
          </Button>
          <IDKitWidget
            app_id="app_staging_6ec3ea829a0d16fa66a44e9872b70153"
            action={`createPetition-${hash}`} // or signPetition
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
                await instance.createPetition(hash, cid, metadata);
              } catch (err: any) {
                storeNotif("Error", err?.message ? err.message : err, "danger");
              }

              showModal(MODAL_TYPE.SHARE, { url: `${"VERCEL"}/${hash}` });
            }}
            enableTelemetry
          >
            {({ open }) => (
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
                    handleCid(storage.transaction.itemId ?? "");

                    open();
                  }
                  handleStep(step + 1);
                }}
              >
                {step === 0 ? "Next" : step === 1 ? "Preview Petition" : "Create and Share"}
              </Button>
            )}
          </IDKitWidget>
        </div>
      </div>
    </>
  );
}

export default Landing;
