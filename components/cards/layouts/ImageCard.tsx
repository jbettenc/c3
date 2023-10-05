import { useENS } from "@/utils/hooks/useENS";
import Card from "../Card";

interface ImageCardProps {
  image: any;
  title: string;
  petitioner: string;
  onClick?: (e: React.MouseEvent) => void;
}

function ImageCard(props: ImageCardProps) {
  const { alias } = useENS(props.petitioner);

  return (
    <Card onClick={props.onClick}>
      <div className="w-full h-full bg-red-75 p-8">
        <div className="w-full h-full flex flex-col overflow-hidden">
          <img src={props.image} alt={props.title} className="rounded-full mx-auto h-[9.75rem] w-[9.75rem]" />
          <div className="text-center my-3 font-semibold text-xs">
            {alias
              ? alias
              : `${props.petitioner.substring(0, 6)}...${props.petitioner.substring(props.petitioner.length - 6)}`}
          </div>
          <div className="text-white font-bold text-center my-auto break-words">{props.title}</div>
        </div>
      </div>
    </Card>
  );
}

export default ImageCard;
