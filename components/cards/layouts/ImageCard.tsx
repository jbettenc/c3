import { useENS } from "@/utils/hooks/useENS";
import Card from "../Card";
import SignatureProgressBar from "@/components/SignatureProgressBar";
import Button from "@/ui/forms/Button";
import { parseImage } from "@/utils/misc";
import AutoScroll from "@/ui/scroll/AutoScroll";
import { useElementSize } from "@/utils/hooks/useElementSize";

interface ImageCardProps {
  loading?: boolean;
  prefix: string;
  image: any;
  title: string;
  petitioner: string;
  tier0Signatures?: number;
  tier1Signatures?: number;
  tier2Signatures?: number;
  onClick?: (e: React.MouseEvent) => void;
}

function ImageCard(props: ImageCardProps) {
  const { prefix, tier0Signatures, tier1Signatures, tier2Signatures } = props;

  const [, setRef, { height }] = useElementSize();

  const { alias } = useENS(props.petitioner);

  if (props.loading) {
    return (
      <Card>
        <div className="w-full h-full bg-gray-20 p-6 border-2 border-gray-50 rounded-lg">
          <div className="animate-pulse w-full h-full flex flex-col overflow-hidden">
            <div className="bg-gray-300/30 rounded-lg mx-auto min-h-[4rem] h-full min-w-[9.75rem] max-w-full shrink object-contain"></div>
            <div className="bg-gray-300/30 rounded-md mx-auto my-2 h-10 w-24"></div>
            <div className="bg-gray-300/30 rounded-md mx-auto h-12 w-44"></div>
            <div className="shrink-0 flex flex-col mt-2">
              <div className="bg-gray-300/30 rounded-full h-2.5"></div>
              <div className="mt-2 bg-gray-300/30 rounded-md h-4 w-24"></div>
              <div className="mt-2 bg-gray-300/30 rounded-md "></div>
              <div className="mt-2 bg-gray-300/30 w-full h-[2.25rem] rounded-md"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className={`w-full h-full ${prefix === "" ? "bg-red-75" : "bg-[#262D33]"} p-6`}>
        <div className="w-full h-full flex flex-col overflow-hidden">
          <img
            src={parseImage(props.image)}
            alt={props.title}
            className="rounded-lg mx-auto min-h-[4rem] h-full min-w-[9.75rem] max-w-full shrink object-contain"
            draggable={false}
          />
          <div
            className={`text-center my-2 font-semibold text-xs ${prefix === "" ? "text-[#FFC4C9]" : "text-[#FFC4C9]"}`}
          >
            {alias
              ? alias
              : `${props.petitioner.substring(0, 6)}...${props.petitioner.substring(props.petitioner.length - 6)}`}
          </div>
          <div ref={setRef} className="min-h-[2rem]">
            <AutoScroll height={height} speed={1}>
              <div
                className={`${
                  prefix === "" ? "text-white" : "text-white"
                } text-center my-auto break-words font-anton min-h-[2rem] cursor-pointer`}
                onClick={props.onClick}
              >
                {props.title.toUpperCase()}
              </div>
            </AutoScroll>
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
