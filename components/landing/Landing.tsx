import { useEffect, useState } from "react";
import { IPetition } from "@/types";
import Button from "@/ui/forms/Button";
import { StartIcon } from "../icons/StartIcon";
import { getPetitions } from "@/utils/queries";
import CardLoader from "../cards/CardLoader";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import { DEFAULT_CHAIN_ID } from "@/constants/constants";
import dynamic from "next/dynamic";

// Uses ResizeObserver, which can only render on the frontend.
const HorizontalScrollContainer = dynamic(() => import("@/ui/HorizontalScrollContainer"), {
  ssr: false
});

function Landing() {
  const [petitions, handlePetitions] = useState<IPetition[] | null>([]);

  const { chainId } = useWeb3React();

  useEffect(() => {
    (async () => {
      handlePetitions(await getPetitions(chainId ?? DEFAULT_CHAIN_ID));
    })();
  }, [chainId]);

  return (
    <div className="w-full pb-16 md:pb-4">
      <div className="w-full max-w-7xl flex flex-col justify-center text-center mt-8 px-2 items-center mx-auto">
        <div className="text-black font-extrabold italic text-6xl leading-none font-poppins">
          Communities Creating <span className="text-primary-900">Change</span>
        </div>
        <div className="flex mt-8 items-center md:flex-row flex-col md:w-auto w-68 gap-x-6 gap-y-1">
          <Link href="/create">
            <Button
              style="primary"
              className="md:w-60 w-full"
              customFont={true}
              icon={<StartIcon className="w-6 h-6" />}
            >
              Start a Petition Today
            </Button>
          </Link>
          {/* <span className="font-semibold leading-6 text-base text-black py-2">OR</span>
          <Button
            style="secondary"
            className="flex items-center md:w-60 w-full"
            icon={<SearchIcon className="w-6 h-6 fill-gray-700" />}
            onClick={() => {
              window.open("https://twitter.com/thedealart", "_blank");
            }}
          >
            Search for a Petition
          </Button> */}
        </div>
        <HorizontalScrollContainer
          title="Petitions"
          items={
            petitions &&
            petitions.map((petition, idx) => (
              <div
                key={`item-${idx}`}
                className="grow shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5 overflow-hidden px-2"
              >
                <CardLoader petition={petition} key={`landing-petition-${idx}`} />
              </div>
            ))
          }
        />
      </div>
    </div>
  );
}

export default Landing;
