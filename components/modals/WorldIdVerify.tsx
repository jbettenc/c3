import Image from "next/image";
import Button from "@/ui/forms/Button";
import WorldCoinLogo from "../../assets/WorldCoinLogo.svg";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IDKitWidget, VerificationLevel, useIDKit } from "@worldcoin/idkit";
import { useWeb3React } from "@web3-react/core";
import { WorldCoinIcon } from "../icons/WorldCoinLogo";
import { PhoneIcon } from "../icons/PhoneIcon";
import { DEFAULT_CHAIN_ID, WORLDCOIN_APP_ID } from "@/constants/constants";

interface WorldIdVerifyProps {
  hash: string;
  onSuccess: (e: {
    merkle_root: string;
    nullifier_hash: string;
    proof: string;
    verification_level: VerificationLevel;
  }) => Promise<void>;
}

function WorldIdVerify(props: WorldIdVerifyProps) {
  const { hash, onSuccess } = props;

  const [step, handleStep] = useState(0);
  const [credentialType, handleCredentialType] = useState<VerificationLevel>();
  const [appId, handleAppId] = useState<`app_${string}`>(WORLDCOIN_APP_ID(DEFAULT_CHAIN_ID, VerificationLevel.Orb));
  const [action, handleAction] = useState(`createPetition-${hash}`);

  const { account, chainId } = useWeb3React();

  useEffect(() => {
    if (hash) {
      handleAction(`createPetition-${hash}`);
    }
  }, [hash]);

  const { open: idKitOpen, setOpen: setIdKitOpen } = useIDKit();

  useEffect(() => {
    if (credentialType) {
      setIdKitOpen(true);
    }
  }, [credentialType]);

  if (step === 0) {
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
            <Button
              className="w-full sm:w-[49%]"
              onClick={async () => {
                handleStep(1);
              }}
            >
              Sign with World ID
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col p-8">
        <Image src={WorldCoinLogo} alt="WorldCoin" className="mx-auto" />
        <div className="text-lg font-medium text-center my-4">Select Your World ID Verification Type</div>
        <div className="w-full flex gap-4">
          <div
            className="flex flex-col w-full rounded-lg border border-black bg-white text-black hover:border-primary-600 hover:bg-primary-50 hover:text-primary-800 text-center p-4 cursor-pointer gap-4"
            onClick={() => {
              handleAppId(WORLDCOIN_APP_ID(chainId ?? DEFAULT_CHAIN_ID, VerificationLevel.Orb));
              handleCredentialType(VerificationLevel.Orb);
            }}
          >
            <WorldCoinIcon className="mx-auto w-6 h-6" />
            <div className="text-sm font-medium leading-none">Orb Verified</div>
          </div>
          <div
            className="flex flex-col w-full rounded-lg border border-black bg-white text-black hover:border-primary-600 hover:bg-primary-50 hover:text-primary-800 text-center p-4 cursor-pointer gap-4"
            onClick={() => {
              handleAppId(WORLDCOIN_APP_ID(chainId ?? DEFAULT_CHAIN_ID, VerificationLevel.Device));
              handleCredentialType(VerificationLevel.Device);
            }}
          >
            <PhoneIcon className="mx-auto w-6 h-6" />
            <div className="text-sm font-medium leading-none">Phone Verified</div>
          </div>
          <IDKitWidget
            app_id={appId}
            action={action}
            signal={account ?? ""}
            verification_level={credentialType}
            handleVerify={async (e: {
              merkle_root: string;
              nullifier_hash: string;
              proof: string;
              verification_level: VerificationLevel;
            }) => {
              // Only perform backend check if the credential type is device. Orb performed on chain.
              if (
                e.verification_level === VerificationLevel.Device &&
                appId === WORLDCOIN_APP_ID(chainId ?? DEFAULT_CHAIN_ID, VerificationLevel.Orb)
              ) {
                throw new Error("Please use an Orb Verified account for on-chain petition creation.");
              }
            }}
            onSuccess={onSuccess}
          ></IDKitWidget>
        </div>
      </div>
    </>
  );
}

export default WorldIdVerify;
