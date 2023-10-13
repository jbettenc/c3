import Image from "next/image";
import DiscordIcon from "../../assets/Discord.svg";
import TelegramIcon from "../../assets/Telegram.svg";
import XIcon from "../../assets/X.svg";
import Button from "@/ui/forms/Button";
import { copyStringToClipboard, storeNotif } from "@/utils/misc";
import { Carousel } from "react-responsive-carousel";

interface ShareProps {
  url?: string;
  title?: string;
  creator?: string;
  images?: string[];
}

function Share(props: ShareProps) {
  return (
    <>
      <div className="flex flex-col p-8 gap-4">
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
        <div className="rounded-lg bg-gray-50 border border-gray-200 overflow-hidden">
          <div className="rounded-b-md bg-white p-4 border-b">
            <div className="font-plex font-semibold text-sm">{props.title}</div>
            <div className="text-xs text-gray-600">{props.creator}</div>
            {props.images?.length && props.images.length > 0 ? (
              <div className="w-full max-h-[10rem] overflow-hidden carousel-height-limit mt-4">
                <Carousel dynamicHeight={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                  {props.images.map((file, idx) => (
                    <div className="" key={`shareimages-${idx}`}>
                      <img className="w-full h-auto" src={file} alt="Image" />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : null}
          </div>
          <div className="p-4">
            <div className="font-bold">Show your support by signing this petition today.</div>
            <div className="text-sm text-gray-600">C3: Communities Creating Change</div>
          </div>
        </div>
        <div className="flex flex-row rounded-md bg-gray-50 border border-gray-200 p-2">
          <div className="my-auto mx-2 truncate">{props.url}</div>
          <Button
            className="ml-auto"
            customColor="bg-purple-300 hover:bg-purple-300/90"
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
