import { useState } from "react";
import { ETHSIGN_PETITION_API_URL } from "@/constants/constants";
import { IPetition } from "@/types";
import Button from "@/ui/forms/Button";
import { getProviderUrl, storeNotif } from "@/utils/misc";
import { useWeb3React } from "@web3-react/core";
import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import { AbiCoder, Contract, ethers } from "ethers";
import C3ABI from "../../artifacts/C3.json";
import Image from "next/image";
import WorldCoinLogo from "../../assets/WorldCoinLogo.svg";
import Link from "next/link";
import { WorldCoinIcon } from "../icons/WorldCoinLogo";
import { PhoneIcon } from "../icons/PhoneIcon";

interface SignPetitionProps {
  petition?: IPetition;
}

function SignPetition(props: SignPetitionProps) {
  const { petition } = props;
  const [step, handleStep] = useState(0);
  const { account, library } = useWeb3React();
  if (step === 0) {
    return (
      <>
        <div className="flex flex-col p-8">
          <Image src={WorldCoinLogo} alt="WorldCoin" className="mx-auto" />
          <div className="text-lg font-medium text-center my-4">Sign With Your World ID</div>
          <div className="mt-2 text-sm text-center">
            Sign the petition with your verified World ID identity to increase the authenticity of your signature.
          </div>
          <Link href="https://worldcoin.org/world-id" className="mx-auto">
            <div className="text-sm cursor-pointer underline text-primary-900 hover:text-primary-700">{`What's World ID?`}</div>
          </Link>
          <div className="flex flex-col sm:flex-row w-full mt-8 justify-between gap-2 sm:gap-0">
            <div className="w-full sm:w-[49%]">
              <Button
                style="secondary"
                className="w-full"
                onClick={async () => {
                  let payload = {
                    address: account
                  };

                  const messagePayload = {
                    address: account,
                    timestamp: new Date().toISOString(),
                    version: "4.1",
                    hash: ethers.hashMessage(
                      JSON.stringify({
                        data: payload
                      })
                    )
                  };

                  // messages converted to string before sign with statement prefix
                  const message = `EthSign is requesting your signature to validate the data being uploaded. This action does not incur any gas fees.\n\n~\n\n${JSON.stringify(
                    messagePayload,
                    null,
                    2
                  )}`;

                  // sign signature with the messages in details
                  const signature = await library.provider.request({
                    method: "personal_sign",
                    params: [message, account]
                  });

                  // payload to upload arweave storage
                  const storagePayload = {
                    petitionId: petition?.id ?? "0x00",
                    signature,
                    message,
                    address: account
                  };
                  try {
                    await fetch(`${ETHSIGN_PETITION_API_URL}/sign`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json"
                      },
                      body: JSON.stringify(storagePayload)
                    })
                      .then((res) => res.json())
                      .then((response) => {
                        if (!response || response.error || !response.success) {
                          storeNotif(
                            "Error Signing Petition",
                            response?.error ? response.error.message : response?.message ? response.message : response,
                            "danger"
                          );
                          return;
                        }
                      });
                  } catch (err: any) {
                    storeNotif("Error", err?.message ? err.message : err, "danger");
                  }
                }}
              >
                Sign as Visitor
              </Button>
            </div>
            <Button
              className="w-full sm:w-[49%]"
              onClick={async () => {
                handleStep(1);
              }}
            >
              Sign with WorldCoin
            </Button>
          </div>
        </div>
      </>
    );
  }
  return (
    // TODO: CHECK Z-INDEX FOR WORLDCOIN AND OUR MODALS HERE. MIGHT POSE A PROBLEM.
    <>
      <div className="flex flex-col p-8">
        <Image src={WorldCoinLogo} alt="WorldCoin" className="mx-auto" />
        <div className="text-lg font-medium text-center my-4">Select Your World ID Verification Type</div>
        <div className="w-full flex gap-4">
          <IDKitWidget
            app_id="app_staging_6ec3ea829a0d16fa66a44e9872b70153"
            action={`signPetition-${petition?.id ?? "0x00"}`}
            signal={account ?? ""}
            credential_types={[CredentialType.Orb]}
            onSuccess={async (e: {
              merkle_root: string;
              nullifier_hash: string;
              proof: string;
              credential_type: CredentialType;
            }) => {
              const provider = new ethers.JsonRpcProvider(await getProviderUrl(library));
              // This address is only for Base
              const contract = new Contract("0x36e3f7a8C88EE63740b50f7b87c069a74e461f85", C3ABI.abi, provider);
              const instance = contract.connect(library.getSigner()) as Contract;
              const proof = [...[...AbiCoder.defaultAbiCoder().decode(["uint256[8]"], e.proof)][0]];
              const metadata = {
                root: e.merkle_root,
                nullifierHash: e.nullifier_hash,
                proof: proof
              };
              try {
                await instance.signPetition(petition?.id ?? "", metadata);
                storeNotif("Success", "Petition signed.", "success");
              } catch (err: any) {
                storeNotif("Error", err?.message ? err.message : err, "danger");
              }
            }}
            enableTelemetry
          >
            {({ open }) => (
              <div
                className="flex flex-col w-full rounded-lg border border-black bg-white text-black hover:border-primary-600 hover:bg-primary-50 hover:text-primary-800 text-center p-4 cursor-pointer gap-4"
                onClick={() => open()}
              >
                <WorldCoinIcon className="mx-auto w-6 h-6" />
                <div className="text-sm font-medium leading-none">Orb Verified</div>
              </div>
            )}
          </IDKitWidget>

          <IDKitWidget
            app_id="app_staging_0ff1142a912bb109636e597b70d6b978"
            action={`signPetition`}
            action_description={`${petition?.id ?? "0x00"}`}
            signal={account ?? ""}
            credential_types={[CredentialType.Phone]}
            onSuccess={async (e: {
              merkle_root: string;
              nullifier_hash: string;
              proof: string;
              credential_type: CredentialType;
            }) => {
              try {
                // Call backend
                await fetch(`${ETHSIGN_PETITION_API_URL}/sign`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    ...e,
                    petitionId: petition?.id ?? "0x00",
                    action: "signPetition",
                    action_description: `${petition?.id ?? "0x00"}`,
                    signal: account ?? ""
                  })
                })
                  .then((res) => res.json())
                  .then((response) => {
                    if (!response || response.error || !response.success) {
                      storeNotif(
                        "Error Signing Petition",
                        response?.error ? response.error.message : response?.message ? response.message : response,
                        "danger"
                      );
                      return;
                    }

                    // TODO: Handle successful response
                  });
                // await instance.signPetition(petition?.id ?? "", metadata);
                storeNotif("Success", "Petition signed.", "success");
              } catch (err: any) {
                storeNotif("Error Signing Petition", err?.message ? err.message : err, "danger");
              }
            }}
            enableTelemetry
          >
            {({ open }) => (
              <div
                className="flex flex-col w-full rounded-lg border border-black bg-white text-black hover:border-primary-600 hover:bg-primary-50 hover:text-primary-800 text-center p-4 cursor-pointer gap-4"
                onClick={() => open()}
              >
                <PhoneIcon className="mx-auto w-6 h-6" />
                <div className="text-sm font-medium leading-none">Phone Verified</div>
              </div>
            )}
          </IDKitWidget>
        </div>
      </div>
    </>
  );
}

export default SignPetition;
