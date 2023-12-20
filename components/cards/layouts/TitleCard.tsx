import { useENS } from "@/utils/hooks/useENS";
import Card from "../Card";
import SignatureProgressBar from "@/components/SignatureProgressBar";
import Button from "@/ui/forms/Button";
import AutoScroll from "@/ui/scroll/AutoScroll";

interface TitleCardProps {
  title: string;
  prefix: string;
  petitioner: string;
  verificationStatus?: number; // 0 = none, 1 = device, 2 = orb
  tier0Signatures?: number;
  tier1Signatures?: number;
  tier2Signatures?: number;
  onClick?: (e: React.MouseEvent) => void;
}

function TitleCard(props: TitleCardProps) {
  const { tier0Signatures, tier1Signatures, tier2Signatures, prefix } = props;
  const { alias, avatar } = useENS(props.petitioner);

  return (
    <Card>
      <div className={`w-full h-full ${prefix === "" ? "bg-[#FFD980] " : "bg-[#262D33] "} p-6`}>
        <div className="w-full h-full flex flex-col max-h-full">
          <div
            className={`shrink-0 font-semibold text-start mb-2 text-xs ${
              prefix === "" ? "text-primary-600" : "text-[#FFC4C9]"
            }`}
          >
            {alias
              ? alias
              : `${props.petitioner.substring(0, 6)}...${props.petitioner.substring(props.petitioner.length - 6)}`}
          </div>
          <AutoScroll height={206} speed={1}>
            <div
              className={`${
                prefix === "" ? "text-black text-4xl" : "text-white text-4xl"
              } font-anton text-left break-words shrink leading-tight cursor-pointer`}
              onClick={props.onClick}
            >
              {props.title.toUpperCase()}
            </div>
          </AutoScroll>

          <div className="shrink-0 flex flex-col mt-2">
            <SignatureProgressBar
              tier0Signatures={tier0Signatures ?? 0}
              tier1Signatures={tier1Signatures ?? 0}
              tier2Signatures={tier2Signatures ?? 0}
              showCount
              primaryColor="bg-purple-600"
              secondaryColor="bg-purple-500"
              tertiaryColor="bg-purple-400"
              customCountStyle={`${prefix === "" ? "text-black" : "text-white"} text-xs font-medium text-left mt-2`}
              tooltipHidden={true}
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
