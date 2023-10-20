import { useState, useEffect } from "react";
// @ts-ignore
import { Web3Storage, Web3File } from "web3.storage/dist/bundle.esm.min.js";
import { ArweavePayload, ResponseObject, StoragePayload, StorageResponse } from "@/types";
import { ETHSIGN_API_URL, ETHSIGN_PETITION_API_URL } from "@/constants/constants";

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

/**
 * Get the Tier 0 and 1 signature count from our backend.
 *
 * @param id - Petition ID.
 * @returns Signature count or error message.
 */
export const getSignaturesForPetition = async (
  id: string
): Promise<{ error?: { message: string }; success?: boolean; message?: string } | null> => {
  let ret: any = null;
  try {
    await fetch(`${ETHSIGN_PETITION_API_URL}/petition/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((response) => (ret = response ?? { error: { message: "No response" } }));
  } catch (err: any) {
    return { error: { message: err?.message ? err.message : err } };
  }

  return ret;
};
