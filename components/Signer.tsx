import IdentIcon from "./common/IdentIcon";
import Image from "next/image";
import { useENS } from "@/utils/hooks/useENS";
import { WorldCoinIcon } from "./icons/WorldCoinLogo";
import { ProfileBlankIcon } from "./icons/ProfileBlankIcon";

interface SignerProps {
  loading?: boolean;
  address?: string;
  verificationType?: number;
}

function Signer(props: SignerProps) {
  const { loading, address, verificationType = 0 } = props;
  const { avatar, alias } = useENS(address);

  if (loading) {
    return (
      <>
        <div className="flex animate-pulse">
          <div className="my-auto p-1">
            <div className="bg-gray-300/30 w-7 h-7 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <div className="flex font-semibold flex-wrap gap-x-2">
              <div className="h-6 w-24 bg-gray-300/30 rounded-md"></div>
              <div className={` bg-gray-300/30 rounded-full h-6 w-24 my-auto`}></div>
            </div>

            <div className="mt-2 h-6 w-36 bg-gray-300/30 rounded-md"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex">
        <div className="my-auto">
          {avatar ? (
            <Image className="w-9 h-9 rounded-full object-cover" src={avatar} alt="" />
          ) : (
            <div className="p-2">
              <IdentIcon
                string={props.address}
                size={17}
                palette={["#FFC32A", "#AEDFFB", "#6C66E9", "#FFDB80", "#CDCDCD", "#000000", "#C9AEFB", "#B9E5D4"]}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {alias ? (
            <div className="flex font-semibold flex-wrap gap-x-2">
              {alias}
              {verificationType > 0 ? (
                <div
                  className={`flex flex-nowrap shrink-0 font-medium ${
                    verificationType === 2 ? "bg-orange-50 text-orange-700" : "bg-purple-25 text-purple-501"
                  } rounded-full px-3 text-sm my-auto`}
                >
                  <WorldCoinIcon className="h-4 w-4 my-auto mr-2" />
                  {verificationType === 2 ? "Orb" : "Phone"} Verified
                </div>
              ) : (
                <div
                  className={`flex flex-nowrap shrink-0 font-medium text-gray-700 bg-gray-50 rounded-full px-3 text-sm my-auto`}
                >
                  <ProfileBlankIcon className="h-4 w-4 my-auto mr-2" />
                  Visitor
                </div>
              )}
            </div>
          ) : null}
          <div className={`${!alias ? "my-auto flex flex-wrap gap-x-2" : ""}`}>
            {props.address
              ? props.address.substring(0, 6) + "..." + props.address.substring(props.address.length - 6)
              : "--"}
            {!alias ? (
              verificationType > 0 ? (
                <div
                  className={`flex flex-nowrap shrink-0 ml-2 font-medium ${
                    verificationType === 2 ? "bg-orange-50 text-orange-700" : "bg-purple-25 text-purple-501"
                  } rounded-full px-3 text-sm my-auto`}
                >
                  <WorldCoinIcon className="h-4 w-4 my-auto mr-2" />
                  {verificationType === 2 ? "Orb" : "Phone"} Verified
                </div>
              ) : (
                <div
                  className={`flex flex-nowrap shrink-0 font-medium text-gray-700 bg-gray-50 rounded-full px-3 text-sm my-auto`}
                >
                  <ProfileBlankIcon className="h-4 w-4 my-auto mr-2" />
                  Visitor
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Signer;
