import Button from "@/ui/forms/Button";
import Image from "next/image";
import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import IdentIcon from "./common/IdentIcon";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import { RootState } from "@/store/root";
import { copyStringToClipboard } from "@/utils/misc";

interface PetitionProps {}

function Petition(props: PetitionProps) {
  const [importState, handleImportState] = useState<File[]>([]);
  const { ethAvatar } = useSelector((state: RootState) => state.user);

  const { account } = useWeb3React();
  return (
    <>
      <div className="flex text-black w-full mb-16 px-4">
        <div className="mt-4 flex max-w-7xl mx-auto w-full gap-4">
          <div className="flex flex-col max-w-5xl w-full gap-4">
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div className="font-semibold text-lg">Title</div>
              <div>0x000</div>
            </div>
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div>Description</div>
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
            </div>
          </div>
          <div className="flex flex-col max-w-lg w-full">
            <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md p-4">
              <div className="flex">
                <div className="font-lg font-semibold mr-2">Signers</div>
                <div className="bg-orange-50 text-orange-700 rounded-full px-3 text-sm my-auto">10000 signatures</div>
              </div>
              <div className="flex">
                <div className="my-auto mr-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-orange-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                </div>
                <div className="whitespace-nowrap">Goal: 20000</div>
              </div>
              <table>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="py-2 pl-4">
                    <div className="text-left">Name</div>
                  </th>
                  <th className="py-2 pr-4">
                    <div className="text-left">Sign Date</div>
                  </th>
                </tr>
                <tr>
                  <td className="pl-4 py-2">
                    <div className="flex">
                      <div className="my-auto">
                        {ethAvatar ? (
                          <Image className="w-9 h-9 rounded-full object-cover" src={ethAvatar} alt="" />
                        ) : (
                          <div className="p-2">
                            <IdentIcon
                              string={account ? account : ""}
                              size={17}
                              palette={[
                                "#FFC32A",
                                "#AEDFFB",
                                "#6C66E9",
                                "#FFDB80",
                                "#CDCDCD",
                                "#000000",
                                "#C9AEFB",
                                "#B9E5D4"
                              ]}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="font-semibold">account</div>
                        <div>account2</div>
                      </div>
                    </div>
                  </td>
                  <td className="pr-4 py-2">2023/12/12</td>
                </tr>
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
          <Button className="my-auto ml-auto">Sign Petition</Button>
          <Button className="ml-2" style="secondary" onClick={() => copyStringToClipboard(window.location.href)}>
            Share Petition
          </Button>
        </div>
      </div>
    </>
  );
}

export default Petition;
