import { useENS } from "@/utils/hooks/useENS";
import Card from "../Card";
import SignatureProgressBar from "@/components/SignatureProgressBar";
import Button from "@/ui/forms/Button";

interface ImageCardProps {
  image: any;
  title: string;
  petitioner: string;
  tier0Signatures?: number;
  tier1Signatures?: number;
  tier2Signatures?: number;
  onClick?: (e: React.MouseEvent) => void;
}

function ImageCard(props: ImageCardProps) {
  const { tier0Signatures, tier1Signatures, tier2Signatures } = props;

  const { alias } = useENS(props.petitioner);

  return (
    <Card>
      <div className="w-full h-full bg-red-75 p-6">
        <div className="w-full h-full flex flex-col overflow-hidden">
          <img
            src={props.image}
            alt={props.title}
            className="rounded-lg mx-auto min-h-[4rem] h-full min-w-[9.75rem] max-w-full shrink object-cover"
          />
          <div className="text-center my-3 font-semibold text-xs text-[#FFC4C9]">
            {alias
              ? alias
              : `${props.petitioner.substring(0, 6)}...${props.petitioner.substring(props.petitioner.length - 6)}`}
          </div>
          <div className="text-white text-center my-auto break-words font-anton min-h-[2rem] overflow-hidden">
            {props.title.toUpperCase()}
          </div>
          <div className="shrink-0 flex flex-col mt-2">
            <SignatureProgressBar
              tier0Signatures={tier0Signatures ?? 0}
              tier1Signatures={tier1Signatures ?? 0}
              tier2Signatures={tier2Signatures ?? 0}
              showCount
              primaryColor="bg-purple-600"
              secondaryColor="bg-purple-500"
              tertiaryColor="bg-purple-400"
              customCountStyle={`text-white text-xs font-medium text-left mt-2`}
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

export default ImageCard;
