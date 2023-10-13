import Image from "next/image";
import DiscordIcon from "../../assets/Discord.svg";
import TelegramIcon from "../../assets/Telegram.svg";
import XIcon from "../../assets/X.svg";
import Button from "@/ui/forms/Button";
import { copyStringToClipboard, storeNotif } from "@/utils/misc";
import WorldCoinLogo from "../../assets/WorldCoinLogo.svg";
import Link from "next/link";

interface WorldIdVerifyProps {
  idkitButton: JSX.Element;
}

function WorldIdVerify(props: WorldIdVerifyProps) {
  return (
    <>
      <div className="flex flex-col p-8">
        <Image src={WorldCoinLogo} alt="WorldCoin" className="mx-auto" />
        <div className="text-lg font-medium text-center my-4">Verify Your Identity with World ID</div>
        <div className="mt-2 text-sm text-center">
          We require all petition initiators verify their identities
          <br />
          with World ID to ensure the authenticity of petitions.
        </div>
        <Link href="https://worldcoin.org/world-id" className="mx-auto">
          <div className="text-sm cursor-pointer underline text-primary-900 hover:text-primary-700">{`What's World ID?`}</div>
        </Link>
        <div className="flex flex-col sm:flex-row w-full mt-8 justify-between gap-2 sm:gap-0">
          <Link href="/" className="w-full sm:w-[49%]">
            <Button style="secondary" className="w-full">
              Browse Petitions
            </Button>
          </Link>
          {props.idkitButton}
        </div>
      </div>
    </>
  );
}

export default WorldIdVerify;
