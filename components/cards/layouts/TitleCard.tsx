import { useState } from "react";
import { useENS } from "@/utils/hooks/useENS";
import Card from "../Card";
import Image from "next/image";
import IdentIcon from "@/components/common/IdentIcon";
import SignatureProgressBar from "@/components/SignatureProgressBar";
import Button from "@/ui/forms/Button";

interface TitleCardProps {
  title: string;
  petitioner: string;
  verificationStatus?: number; // 0 = none, 1 = phone, 2 = orb
  signatures: number;
  onClick?: (e: React.MouseEvent) => void;
}

function TitleCard(props: TitleCardProps) {
  const { verificationStatus = 1, signatures } = props;
  const { alias, avatar } = useENS(props.petitioner);

  return (
    <Card>
      <div
        className={`w-full h-full ${
          verificationStatus === 2 ? "bg-[#FFD980] " : verificationStatus === 1 ? "bg-[#262D33] " : "bg-[#6D75E7] "
        } p-6`}
      >
        <div className="w-full h-full flex flex-col max-h-full">
          <div
            className={`shrink-0 font-semibold text-start mb-2 text-xs ${
              verificationStatus === 2 ? "text-primary-600" : "text-[#FFC4C9]"
            }`}
          >
            {alias
              ? alias
              : `${props.petitioner.substring(0, 6)}...${props.petitioner.substring(props.petitioner.length - 6)}`}
          </div>
          <div
            className={`${
              verificationStatus === 2
                ? "text-black text-4xl"
                : verificationStatus === 1
                ? "text-white text-4xl"
                : "text-white"
            } font-anton text-left mb-auto break-words shrink overflow-hidden leading-tight`}
          >
            {props.title.toUpperCase()}
          </div>

          <div className="shrink-0 flex flex-col mt-2">
            <SignatureProgressBar
              signatures={signatures ?? 0}
              showCount
              color="bg-gradient-to-r from-purple-600 to-purple-500"
              customCountStyle={`${
                verificationStatus === 2 ? "text-black" : "text-white"
              } text-xs font-medium text-left mt-2`}
            />
            <Button style="secondary" onClick={props.onClick} className="w-full mt-2">
              Sign Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TitleCard;
