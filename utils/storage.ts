import { useState, useEffect } from "react";
// @ts-ignore
import { Web3Storage, Web3File } from "web3.storage/dist/bundle.esm.min.js";
import { ArweavePayload, IPetition, PetitionReport, ResponseObject, StoragePayload, StorageResponse } from "@/types";
import { ETHSIGN_API_URL, PETITION_API_URL } from "@/constants/constants";
import { ReportCategory } from "@/components/modals/ReportPetition";
import { getPetitions } from "./queries";

export function makeStorageClient() {
  return new Web3Storage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDlGNkY1MWQwNjgzOEI3MkZGNTc1M2E5MmQ0YTc3REQ3MjNmMzRENjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2OTU0ODk0Mjc2OTksIm5hbWUiOiJDMyJ9.U5jAjJ9PSnecKzW5IP-L3jsqVp_uJSuUFAb0uJ2TbdU"
  });
}

export const getObj = async (cid: string): Promise<ResponseObject<Web3File>> => {
  let res: any = {};
  await fetch(`https://w3s.link/ipfs/${cid}/metadata.json`, {
    method: "GET"
  })
    .then((res) => res.json())
    .then((result) => (res = result))
    .catch(
      (err) => (res = { success: false, url: `https://w3s.link/ipfs/${cid}/metadata.json`, errorMsg: err.toString() })
    );

  return { success: true, errorMsg: "ok", data: res };
};

export function useWeb3Storage() {
  const [storageClient, handleStorageClient] = useState<Web3Storage>();

  useEffect(() => {
    handleStorageClient(makeStorageClient());
  }, []);

  const storeObj = async (obj: any): Promise<ResponseObject<Web3File>> => {
    if (!storageClient) {
      return { success: false, errorMsg: "Could not create storage client." };
    }
    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

    const file = [new File([blob], `metadata.json`)];
    return { success: true, data: await storageClient.put(file) };
  };

  return {
    storeObj,
    getObj
  };
}

export const postUploadToStorage = async (data: StoragePayload): Promise<StorageResponse | undefined> => {
  let tx: any;
  try {
    await fetch(`${ETHSIGN_API_URL}/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((response) => {
        tx = response;
      })
      .catch((err) => {
        tx = {
          message: "failed",
          transaction: err as any
        };
      });
  } catch (err) {
    tx = {
      message: "failed",
      transaction: err as any
    };
  }

  return tx as any;
};

export const postUploadToStorageBatch = async (data: StoragePayload[]): Promise<StorageResponse[] | undefined> => {
  let tx: any;
  try {
    await fetch(`${ETHSIGN_API_URL}/uploadBatch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ batchedUploads: data })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          tx = response.transactions.map((transaction: { message?: string; itemId?: string }) => ({
            message: response.message,
            transaction
          }));
        }
      })
      .catch((err) => {
        tx = {
          message: "failed",
          transactions: err as any
        };
      });
  } catch (err) {
    tx = {
      message: "failed",
      transactions: err as any
    };
  }

  return tx as any;
};

/**
 * Get file given an Arweave ID.
 *
 * @param id - Arweave ID for the file to retrieve.
 * @returns File.
 */
export const getFileForUser = async (id: string): Promise<ArweavePayload | null> => {
  let ret: any = null;
  try {
    await fetch(`${ETHSIGN_API_URL}/transaction/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((response) => (ret = response ?? []));
  } catch (err) {
    return null;
  }

  return ret?.transaction ? ret.transaction : ret;
};

export const createOffChainPetition = async (prefix: string, cid: string, petitioner: string, metadata: any) => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/petition`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prefix,
        cid,
        petitioner,
        data: null,
        merkle_root: metadata.root,
        nullifier_hash: metadata.nullifierHash,
        proof: metadata.proof,
        verification_level: "device",
        action: metadata.action,
        signal: metadata.signal
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (!response.success) {
          ret = response;
        } else {
          ret = { success: true, data: response.data };
        }
      });
  } catch (err: any) {
    ret = { success: false, message: err?.message ? err.message : err };
  }

  return ret;
};

export const getPetitionOffChain = async (
  prefix: string,
  id: string
): Promise<{
  error?: { message: string };
  success?: boolean;
  message?: string;
  data?: any;
} | null> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/petition/${prefix}${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        justCount: 0
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response && response.data === 1) {
          // Data found for the given petition ID
          ret = {
            success: true,
            data: {
              ...response.petition,
              tier0Signatures: response.tier0Count,
              tier1Signatures: response.tier1Count,
              reportCount: response.reportCount,
              reportMostFrequentCategory: response.reportMostFrequentCategory
            }
          };
        } else if (response && response.data === 0) {
          // No data present in the backend for the given petition ID
          ret = { success: true, data: null };
        } else {
          // Unknown error
          ret = { error: { message: "No response" } };
        }
      });
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};

export const getPetitionOffChainBatch = async (
  ids: { prefix: string; id: string }[]
): Promise<{
  error?: { message: string };
  success?: boolean;
  message?: string;
  data?: any;
} | null> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/batch/petitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ids: ids.map((id) => `${id.prefix}${id.id}`),
        justCount: 0
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response && response.data === 1) {
          // Data found for the given petition ID
          ret = {
            success: true,
            data: {
              ...response.petition,
              tier0Signatures: response.tier0Count,
              tier1Signatures: response.tier1Count,
              reportCount: response.reportCount,
              reportMostFrequentCategory: response.reportMostFrequentCategory
            }
          };
        } else if (response && response.data === 0) {
          // No data present in the backend for the given petition ID
          ret = { success: true, data: null };
        } else {
          // Unknown error
          ret = { error: { message: "No response" } };
        }
      });
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};

/**
 * Get the Tier 0 and 1 signature count from our backend.
 *
 * @param id - Petition ID.
 * @returns Signature count or error message.
 */
export const getSignaturesForPetition = async (
  id: string,
  justCount = 1
): Promise<{
  error?: { message: string };
  success?: boolean;
  message?: string;
  data?:
    | {
        tier0Signatures: number;
        tier1Signatures: number;
        reportCount: number;
        reportMostFrequentCategory: { category: ReportCategory; count: number };
      }
    | any[];
} | null> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/petition/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        justCount
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response && response.data === 1) {
          // Data found for the given petition ID
          if (justCount) {
            ret = {
              success: true,
              data: {
                tier0Signatures: response.tier0Count,
                tier1Signatures: response.tier1Count,
                reportCount: response.reportCount,
                reportMostFrequentCategory: response.reportMostFrequentCategory
              }
            };
          } else {
            ret = {
              success: true,
              data: response.petition.votes
            };
          }
        } else if (response && response.data === 0) {
          // No data present in the backend for the given petition ID
          if (justCount) {
            ret = { success: true, data: { tier0Signatures: 0, tier1Signatures: 0 } };
          } else {
            ret = { success: true, data: [] };
          }
        } else {
          // Unknown error
          ret = { error: { message: "No response" } };
        }
      });
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};

export const getRecommendedPetitions = async (
  chainId: string | number,
  limit = 10,
  justCount = 0,
  inputPetitionIds?: string[]
): Promise<{
  error?: { message: string };
  success?: boolean;
  message?: string;
  data?: IPetition[] | null;
} | null> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/batch/petitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        limit,
        justCount,
        currentPetitions: inputPetitionIds ?? null
      })
    })
      .then((res) => res.json())
      .then(async (response) => {
        if (response) {
          // Data found for the given petition ID
          const ids = response.petitions.map((petition: any) => petition.id);
          const petitionsData = (await getPetitions(chainId, ids)) ?? {};

          // Iterate through backend-loaded recommended petitions
          for (const pet of response.petitions) {
            if (pet.petition.cid === null) {
              // Petition was not created on backend. Prioritize on-chain data.
              petitionsData[pet.id] = {
                ...pet.petition,
                ...(petitionsData[pet.id] ?? { tier2Signatures: 0 }),
                tier0Signatures: pet.tier0Count,
                tier1Signatures: pet.tier1Count,
                reportCount: pet.reportCount,
                reportMostFrequentCategory: pet.reportMostFrequentCategory
              };
            } else if (pet.petition.cid !== "") {
              // If backend object has a cid, it has real data. Prioritize off-chain data.
              petitionsData[pet.id] = {
                ...(petitionsData[pet.id] ?? { tier2Signatures: 0 }),
                ...pet.petition,
                tier0Signatures: pet.tier0Count,
                tier1Signatures: pet.tier1Count,
                reportCount: pet.reportCount,
                reportMostFrequentCategory: pet.reportMostFrequentCategory
              };
            }
          }

          const petitions = ids.map((id: any, idx: number) => {
            const petition = petitionsData
              ? petitionsData[id]
              : {
                  id: "",
                  cid: "",
                  petitioner: "",
                  tier2Signatures: 0,
                  timestamp: ""
                };
            return {
              id: id,
              cid: petition.cid,
              petitioner: petition.petitioner,
              tier0Signatures: response.petitions[idx] ? response.petitions[idx].tier0Count ?? 0 : 0,
              tier1Signatures: response.petitions[idx] ? response.petitions[idx].tier1Count ?? 0 : 0,
              tier2Signatures: petition.tier2Signatures,
              timestamp: petition.timestamp
            };
          });
          ret = {
            success: true,
            data: petitions.filter((pet: IPetition) => pet.cid !== null)
          };
        } else {
          // Unknown error
          ret = { error: { message: "No response" } };
        }
      });
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};

export const getSignaturesForPetitionsBatch = async (
  ids: string[],
  justCount = 1
): Promise<{
  error?: { message: string };
  success?: boolean;
  message?: string;
  data?: { tier0Count: number; tier1Count: number }[];
} | null> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/batch/petitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        justCount,
        ids
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          // Data found for the given petition ID
          ret = {
            success: true,
            data: response.petitions
          };
        } else {
          // Unknown error
          ret = { error: { message: "No response" } };
        }
      });
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};

export const reportPetition = async (
  petitionId: string,
  message: string,
  signature: string,
  address: string
): Promise<{
  error?: { message: string };
  success?: boolean;
  message?: string;
  data?: PetitionReport;
} | null> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        petitionId,
        message,
        signature,
        address
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.data) {
          // Data found for the given petition ID
          ret = {
            success: true,
            data: response.data
          };
        } else {
          // Unknown error
          ret = { error: { message: "Unexpected Error" } };
        }
      });
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};

export const logPageView = async (path: string, referer?: string): Promise<{ success: boolean; message?: string }> => {
  let ret: any = null;
  try {
    await fetch(`${PETITION_API_URL}/m/page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: path,
        lastUrl: referer
      })
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          ret = { success: false, message: response.error.message };
        } else {
          ret = response;
        }
      });
  } catch (err: any) {
    return { success: false, message: err?.message ? err.message : err };
  }

  return ret;
};
