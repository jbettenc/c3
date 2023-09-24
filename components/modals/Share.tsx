import Image from "next/image";
import CloseIcon from "../../assets/close.svg";
import DiscordIcon from "../../assets/Discord.svg";
import TelegramIcon from "../../assets/Telegram.svg";
import LensIcon from "../../assets/Lens.svg";
import XIcon from "../../assets/X.svg";
import Button from "@/ui/forms/Button";

interface ShareProps {
  url?: string;
}

function Share(props: ShareProps) {
  return (
    <>
      <div className="flex flex-col p-8">
        <div className="flex flex-row justify-between mb-4">
          <div className="flex flex-col">
            <Image src={DiscordIcon} alt="Discord" />
            <div className="mx-auto">Discord</div>
          </div>
          <div className="flex flex-col">
            <Image src={XIcon} alt="X" />
            <div className="mx-auto">X</div>
          </div>
          <div className="flex flex-col">
            <Image src={TelegramIcon} alt="Telegram" />
            <div className="mx-auto">Telegram</div>
          </div>
          <div className="flex flex-col">
            <Image src={LensIcon} alt="Lens" />
            <div className="mx-auto">Lens</div>
          </div>
        </div>
        <div className="flex flex-row rounded-md bg-gray-50 border border-gray-100">
          <div className="my-auto ml-2">{props.url}</div>
          <Button className="bg-purple-300 ml-auto" onClick={() => {}}>
            Copy
          </Button>
        </div>
      </div>
    </>
  );
}

export default Share;
