import * as React from "react";
import Image from "next/image";
import pageNotFound from "../../assets/pageNotFound.svg";
import pageNotFound2 from "../../assets/pageNotFound2.svg";
import { useRouter } from "next/router";
import { StartIcon } from "../icons/StartIcon";
import Button from "@/ui/forms/Button";

const images = [pageNotFound, pageNotFound2];

const PageNotFound = () => {
  const router = useRouter();

  const randomNumber = Math.floor(Math.random() * images.length);

  return (
    <div className="px-4 relative">
      <div className="font-poppins text-black block md:flex items-center w-full px-5 md:px-0 max-w-7xl justify-around">
        <Image className="w-full md:w-2/5 order-last z-0" src={images[randomNumber]} alt="Success" />
        <div className="w-full md:w-1/2 mr-10 justify-center text-center md:justify-start md:text-start mt-2 md:mt-0 z-0">
          <p className="font-extrabold italic md:text-7xl text-5xl">Page Not Found</p>
          <p className="mt-4 md:text-2xl text-lg font-normal max-w-2xl">
            The page you are looking for doesn&apos;t exist. Would you like to return home?
          </p>
          <Button
            onClick={() => {
              router.push("/");
            }}
            icon={<StartIcon />}
            className="mt-6"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
