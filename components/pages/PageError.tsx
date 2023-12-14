import * as React from "react";
import Image from "next/image";
import pageError from "../../assets/errorImage.svg";
import pageError2 from "../../assets/errorImage2.svg";
import Head from "next/head";
import Link from "next/link";
import { StartIcon } from "../icons/StartIcon";
import Button from "@/ui/forms/Button";

const images = [pageError, pageError2];

const PageError = () => {
  const randomNumber = Math.floor(Math.random() * images.length);
  return (
    <div className={`flex min-h-screen font-azo opacity-100 text-white items-stretch bg-dot-pattern bg-fixed bg-white`}>
      <Head>
        <title>C3</title>
      </Head>
      <div className="flex flex-col justify-center items-center w-full">
        <div className={`w-full flex flex-col lg:flex-row mx-auto max-w-7xl absolute top-12 ml-4`}>
          <span className="text-black font-extrabold text-4xl leading-none italic">C3</span>
        </div>
        <div className="px-4">
          <div className="left-0 top-0 w-full h-full bg-home-star bg-no-repeat bg-bottom-32 bg-80 -scale-x-100 fixed z-0"></div>
          <div className="font-poppins text-black block md:flex items-center w-full px-5 md:px-0 max-w-7xl">
            <Image className="w-full md:w-2/5 order-last z-10" src={images[randomNumber]} alt="page error" />
            <div className="w-full md:w-1/2 mr-10 z-10 justify-center text-center md:justify-start md:text-start mt-2 md:mt-0">
              <p className="font-extrabold italic md:text-7xl text-5xl">Something Went Wrong...</p>
              <p className="mt-4 md:text-2xl text-lg font-normal max-w-2xl">
                Something went wrong while loading this page. Please try again or go back to the home page.
              </p>
              <Link href="/">
                <Button icon={<StartIcon />} className="mt-6">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageError;
