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
import { useWeb3Storage } from "@/utils/storage";
import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import { IDKitWidget } from "@worldcoin/idkit";

function Landing() {
  const [title, handleTitle] = useState("");
  const [description, handleDescription] = useState("");
  const [step, handleStep] = useState(0);
  const [importState, handleImportState] = useState<File[]>([]);
  const [cid, handleCid] = useState("");
  const [url, handleUrl] = useState("");
  const [hash, handleHash] = useState("");
  const { ethAlias, ethAvatar } = useSelector((state: RootState) => state.user);
  const { account } = useWeb3React();
  const { showModal } = useGlobalModalContext();
  const { storeObj } = useWeb3Storage();

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
              <div className="font-semibold font-medium text-lg">Start a petition</div>
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
                      <div className="font-semibold font-medium text-lg">Add Petition Details</div>
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
                      <div className="font-semibold font-medium text-lg">Add Images</div>
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
            <div className="font-semibold font-medium text-lg">Preview Petition</div>
            <div>Preview your petition before sending it out</div>
          </div>
        </div>
        <div className="my-4 max-w-5xl mx-auto w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
          <div className="font-semibold font-lg">{title}</div>
          <div>{description}</div>
          {importState.length > 0 ? (
            <div className="w-full">
              <Carousel dynamicHeight={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                {importState.map((file) => (
                  <div className="">
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
            action="createPetition" // or signPetition
            signal={account ?? ""}
            onSuccess={(e) => {
              // todo interact with smart contract
              console.log(e);
              // e:
              // {
              //     "merkle_root": "0x1a04af3dffa970c55274470c23db1b628ac24136967b1f94366aaa57558e813c",
              //     "nullifier_hash": "0x2b5e7ece7337317ccbcebb8a36dbac553e6a5fd167d428ada627ddb5e3f1f00c",
              //     "proof": "0x0a883f59c05daaf64d4d7f45ee924670e29b2f43b16c670496d3cb287376213e188ef762a2d2af5bae256e31a672dc78cb383586c1da232805003414bfb10424274f938edf9dbad43cee532d88908fb5c6610067c62b3a33283541091dc7f08e0fb3bb1cc127d17337f17cef0fa069e7c81af874918b4e130bfead994dacfb642634da9fba431675474a158e0aa96d707a3b586b9a661602e843dbfca3a70f712f449db9ddb2afbc15ec76cf54a9d58ab3355287e9172a4ea59f7bb329dfaffa0f0f065e1a4547e2b7fbafdb4f64091a95fc73c5a864f103e6544e57615051591f05a5c7eac408bf8890b3225cda5a6265fe83ed8f008c14036cf088e2e342b5",
              //     "credential_type": "orb"
              // }
              showModal(MODAL_TYPE.SHARE, { url });
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
                    const ret = await storeObj({
                      address: account,
                      title,
                      description,
                      images: importState.map((f) => f.toString())
                    });
                    handleHash(ethers.hashMessage(uuidv4()));
                    handleCid(ret.data);
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
