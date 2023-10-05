import { useState } from "react";
import { useENS } from "@/utils/hooks/useENS";
import Card from "../Card";
import Image from "next/image";
import IdentIcon from "@/components/common/IdentIcon";

interface TitleCardProps {
  title: string;
  petitioner: string;
  onClick?: (e: React.MouseEvent) => void;
}

function TitleCard(props: TitleCardProps) {
  const { alias, avatar } = useENS(props.petitioner);
  const [style, handleStyle] = useState(Math.floor(Math.random() * 3));

  return (
    <Card onClick={props.onClick}>
      <div
        className={`w-full h-full ${
          style === 2 ? "bg-[#FFD980] " : style === 1 ? "bg-[#262D33] " : "bg-[#6D75E7] "
        } p-8`}
      >
        <div className="w-full h-full flex flex-col max-h-full">
          <div
            className={`${
              style === 2 ? "text-black text-2xl" : style === 1 ? "text-white text-2xl" : "text-white"
            } font-bold text-center my-auto break-words shrink overflow-hidden leading-tight`}
          >
            {props.title}
          </div>
          <div className="shrink-0 flex flex-col">
            <div className="text-center my-3 font-semibold text-xs">
              {alias
                ? alias
                : `${props.petitioner.substring(0, 6)}...${props.petitioner.substring(props.petitioner.length - 6)}`}
            </div>
            <div className="mx-auto">
              {avatar ? (
                <Image className="w-9 h-9 rounded-full object-cover" src={avatar} alt="" />
              ) : (
                <div className="p-2">
                  <IdentIcon
                    string={props.petitioner}
                    size={52}
                    palette={["#FFC32A", "#AEDFFB", "#6C66E9", "#FFDB80", "#CDCDCD", "#000000", "#C9AEFB", "#B9E5D4"]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default TitleCard;
