import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, DEFAULT_CHAIN_ID, PETITION_API_URL, WORLDCOIN_APP_ID } from "@/constants/constants";
import { IPetition } from "@/types";
import Button from "@/ui/forms/Button";
import { getProviderUrl, storeNotif } from "@/utils/misc";
import { useWeb3React } from "@web3-react/core";
import { IDKitWidget, VerificationLevel, useIDKit } from "@worldcoin/idkit";
import { Contract, ethers } from "ethers";
import C3ABI from "../../artifacts/C3.json";
import Image from "next/image";
import WorldCoinLogo from "../../assets/WorldCoinLogo.svg";
import Link from "next/link";
import { WorldCoinIcon } from "../icons/WorldCoinLogo";
import { PhoneIcon } from "../icons/PhoneIcon";
import { useGlobalModalContext } from "../context/ModalContext";
import { getLibrary } from "@/web3/utils";
import { defaultAbiCoder } from "ethers/lib/utils";
import parseWeb3Error from "@/web3/parseError";

interface SignPetitionProps {
  petition?: IPetition;
  onSuccess?: (petitionUuid: string, conduit: string, type: number, timestamp: number) => void;
}

function SignPetition(props: SignPetitionProps) {
  const { petition, onSuccess } = props;
  const [step, handleStep] = useState(0);
  const [loading, handleLoading] = useState(false);
  const [credentialType, handleCredentialType] = useState<VerificationLevel>();
  const [appId, handleAppId] = useState<`app_${string}`>(WORLDCOIN_APP_ID(VerificationLevel.Orb));
  const [action, handleAction] = useState(`signPetition-${petition?.id ?? "0x00"}`);
  const { account, chainId, connector } = useWeb3React();
  const { hideModal } = useGlobalModalContext();

  useEffect(() => {
    if (petition) {
      handleAction(`signPetition-${petition.id ?? "0x00"}`);
    }
  }, [petition]);

  const { open: idKitOpen, setOpen: setIdKitOpen } = useIDKit();

  useEffect(() => {
    if (credentialType) {
      setIdKitOpen(true);
    }
  }, [credentialType]);

  if (loading) {
    return (
      <div className="flex flex-col p-8">
        <div role="status" className="mx-auto">
          <svg
            className="inline w-24 h-24 text-gray-200 animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#FDF7F3"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="#D97D40"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        <div className="mt-4 text-center text-lg font-bold opacity-80">Signing petition...</div>
      </div>
    );
  }
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
                  if (!connector.provider) {
                    return;
                  }
                  let payload = {
                    address: account
                  };

                  const messagePayload = {
                    address: account,
                    timestamp: new Date().toISOString(),
                    version: "4.1",
                    hash: ethers.utils.hashMessage(
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
                  const signature = await connector.provider.request({
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
                    handleLoading(true);
                    await fetch(`${PETITION_API_URL}/sign`, {
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
                        storeNotif("Success", "Petition signed.", "success");
                        onSuccess &&
                          onSuccess(petition?.id ?? "", account?.toLowerCase() ?? "", 0, Math.floor(Date.now() / 1000));
                      })
                      .finally(() => handleLoading(false));
                    hideModal(true);
                  } catch (err: any) {
                    handleLoading(false);
                    console.log(err?.message ? err.message : err ?? "");
                    storeNotif("Error", parseWeb3Error(err?.message ? err.message : err ?? ""), "danger");
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
    <>
      <div className="flex flex-col p-8">
        <Image src={WorldCoinLogo} alt="WorldCoin" className="mx-auto" />
        <div className="text-lg font-medium text-center my-4">Select Your World ID Verification Type</div>
        <div className="w-full flex gap-4">
          <div
            className="flex flex-col w-full rounded-lg border border-black bg-white text-black hover:border-primary-600 hover:bg-primary-50 hover:text-primary-800 text-center p-4 cursor-pointer gap-4"
            onClick={() => {
              handleAppId(WORLDCOIN_APP_ID(VerificationLevel.Orb));
              handleCredentialType(VerificationLevel.Orb);
            }}
          >
            <WorldCoinIcon className="mx-auto w-6 h-6" />
            <div className="text-sm font-medium leading-none">Orb Verified</div>
          </div>
          <div
            className="flex flex-col w-full rounded-lg border border-black bg-white text-black hover:border-primary-600 hover:bg-primary-50 hover:text-primary-800 text-center p-4 cursor-pointer gap-4"
            onClick={() => {
              handleAppId(WORLDCOIN_APP_ID(VerificationLevel.Device));
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
                appId === WORLDCOIN_APP_ID(VerificationLevel.Orb)
              ) {
                throw new Error("Please use an Orb Verified account for on-chain petition signatures.");
              }
            }}
            onSuccess={async (e: {
              merkle_root: string;
              nullifier_hash: string;
              proof: string;
              verification_level: VerificationLevel;
            }) => {
              if (e.verification_level === VerificationLevel.Orb) {
                if (!connector.provider) {
                  storeNotif("Error", "No wallet connected.", "danger");
                  return;
                }
                const provider = new ethers.providers.JsonRpcProvider(
                  await getProviderUrl(chainId ?? DEFAULT_CHAIN_ID)
                );
                const contract = new Contract(CONTRACT_ADDRESS(chainId ?? DEFAULT_CHAIN_ID), C3ABI.abi, provider);
                const library = getLibrary(connector.provider);
                const instance = contract.connect(library.getSigner() as any) as Contract;
                const proof = [...[...defaultAbiCoder.decode(["uint256[8]"], e.proof)][0]];
                const metadata = {
                  root: e.merkle_root,
                  nullifierHash: e.nullifier_hash,
                  proof: proof
                };
                try {
                  handleLoading(true);
                  await instance.signPetition(petition?.id ?? "", metadata).then(
                    async (tx: any) =>
                      await tx.wait(1).then(() => {
                        storeNotif("Success", "Petition signed.", "success");
                        onSuccess &&
                          onSuccess(petition?.id ?? "", account?.toLowerCase() ?? "", 2, Math.floor(Date.now() / 1000));
                        hideModal(true);
                      })
                  );
                  handleLoading(false);
                } catch (err: any) {
                  handleLoading(false);
                  console.log(err?.message ? err.message : err ?? "");
                  storeNotif("Error", parseWeb3Error(err?.message ? err.message : err ?? ""), "danger");
                }
              } else if (e.verification_level === VerificationLevel.Device) {
                try {
                  // Call backend
                  handleLoading(true);
                  await fetch(`${PETITION_API_URL}/sign`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      address: account ?? "",
                      merkle_root: e.merkle_root,
                      nullifier_hash: e.nullifier_hash,
                      proof: e.proof,
                      verification_level: "device",
                      petitionId: petition?.id ?? "0x00",
                      action: `signPetition-${petition?.id ?? "0x00"}`,
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
                      storeNotif("Success", "Petition signed.", "success");
                      onSuccess &&
                        onSuccess(petition?.id ?? "", account?.toLowerCase() ?? "", 1, Math.floor(Date.now() / 1000));
                    })
                    .finally(() => handleLoading(false));
                  hideModal(true);
                } catch (err: any) {
                  handleLoading(false);
                  console.log(err?.message ? err.message : err ?? "");
                  storeNotif("Error", parseWeb3Error(err?.message ? err.message : err ?? ""), "danger");
                }
              }
            }}
          ></IDKitWidget>
        </div>
      </div>
    </>
  );
}

export default SignPetition;
