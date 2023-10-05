import Image from "next/image";
import DiscordIcon from "../../assets/Discord.svg";
import TelegramIcon from "../../assets/Telegram.svg";
import XIcon from "../../assets/X.svg";
import Button from "@/ui/forms/Button";
import { copyStringToClipboard, storeNotif } from "@/utils/misc";

interface ShareProps {
  url?: string;
}

function Share(props: ShareProps) {
  return (
    <>
      <div className="flex flex-col p-8">
        <div className="flex flex-row justify-around mb-4">
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => {
              copyStringToClipboard(props.url ?? "");
              window.open("https://discord.com/channels/@me", "_blank");
            }}
          >
            <Image src={DiscordIcon} alt="Discord" />
            <div className="mx-auto">Discord</div>
          </div>
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => {
              window.open(
                encodeURI(
                  `https://twitter.com/intent/tweet?text=${"Please sign and share my petition."}&url=${
                    window.location.href
                  }`
                ),
                "_blank"
              );
            }}
          >
            <Image src={XIcon} alt="X" />
            <div className="mx-auto">X</div>
          </div>
          <div
            className="flex flex-col cursor-pointer"
            onClick={() => {
              window.open(
                encodeURI(
                  `https://telegram.me/share/url?text=${"Please sign and share my petition."}&url=${
                    window.location.href
                  }`
                ),
                "_blank"
              );
            }}
          >
            <Image src={TelegramIcon} alt="Telegram" />
            <div className="mx-auto">Telegram</div>
          </div>
        </div>
        <div className="flex flex-row rounded-md bg-gray-50 border border-gray-100 p-2">
          <div className="my-auto mx-2 truncate">{props.url}</div>
          <Button
            className="bg-purple-300 ml-auto"
            rounded
            onClick={() => {
              copyStringToClipboard(props.url ?? "");
              storeNotif("Copied", "", "info");
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </>
  );
}

export default Share;
