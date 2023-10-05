import { useEffect, useState } from "react";
import { IPetition } from "@/types";
import Button from "@/ui/forms/Button";
import { useRouter } from "next/router";
import { SearchIcon } from "../icons/SearchIcon";
import { StartIcon } from "../icons/StartIcon";
import { getPetitions } from "@/utils/queries";
import CardLoader from "../cards/CardLoader";
import Link from "next/link";

function Landing() {
  const router = useRouter();

  const [petitions, handlePetitions] = useState<IPetition[]>([]);

  useEffect(() => {
    (async () => {
      handlePetitions(await getPetitions());
    })();
  }, []);

  return (
    <div className="w-full pb-16 md:pb-4">
      <div className="w-full max-w-7xl flex flex-col justify-center text-center mt-8 px-2 items-center mx-auto">
        <div className="text-black font-extrabold italic text-6xl leading-none font-poppins">
          Communities Creating <span className="text-red-75">Change</span>
        </div>
        <div className="flex mt-8 items-center md:flex-row flex-col md:w-auto w-68 gap-x-6 gap-y-1">
          <Link href="/create">
            <Button
              style="none"
              className="font-plex select-none font-medium text-sm inline-flex items-center justify-center rounded-md border bg-red-75 hover:bg-[#fd5c5f] text-white md:w-60 w-full px-3 py-2"
              customFont={true}
              size="lg"
              icon={<StartIcon className="w-6 h-6" />}
            >
              Start a Petition
            </Button>
          </Link>
          <span className="font-semibold leading-6 text-base text-black py-2">OR</span>
          <Button
            style="secondary"
            className="flex items-center md:w-60 w-full"
            icon={<SearchIcon className="w-6 h-6 fill-gray-700" />}
            onClick={() => {
              window.open("https://twitter.com/thedealart", "_blank");
            }}
          >
            Search for a Petition
          </Button>
        </div>
        <div className="flex flex-row w-full text-black mt-12">
          <div className="font-bold font-poppins text-2xl">Petitions</div>
        </div>
        <div className="flex flex-wrap w-full gap-4">
          {petitions.map((petition, idx) => (
            <CardLoader petition={petition} key={`landing-petition-${idx}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
