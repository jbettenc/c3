import { GRAPHQL_URL } from "@/constants/constants";
import { IPetition } from "@/types";
import { getSignaturesForPetitionsBatch } from "./storage";

export const loadPetition = async (chainId: string | number, id: string): Promise<IPetition | null> => {
  let res: IPetition | null = null;
  const query = `{
        petition(id: "${id}") {
            id
            cid
            petitioner
            signatures
            timestamp
          }
    }`;

  await fetch(`${GRAPHQL_URL(chainId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  })
    .then((res) => res.json())
    .then((response) => {
      if (response?.data?.petition) {
        res = {
          id: response.data.petition.id,
          cid: response.data.petition.cid,
          petitioner: response.data.petition.petitioner,
          tier2Signatures: response.data.petition.signatures,
          timestamp: response.data.petition.timestamp
        };
      }
    });

  return res ?? null;
};

export const loadPetitionSigners = async (chainId: string | number, id: string) => {
  let res: any = null;
  const query = `{
    petitionSigneds(where: {petitionUuid: "${id}"}) {
      id
      petitionUuid
      conduit
      timestamp
    }
  }`;

  await fetch(`${GRAPHQL_URL(chainId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  })
    .then((res) => res.json())
    .then((response) => {
      res = response?.data?.petitionSigneds;
    });

  return res ?? null;
};

export const getPetitions = async (chainId: string | number, count = 10): Promise<IPetition[] | null> => {
  let res: any = null;
  const query = `{
    petitions(orderBy: signatures, orderDirection: desc, first: ${count}) {
      id
      petitioner
      signatures
      cid
      timestamp
    }
  }`;

  await fetch(`${GRAPHQL_URL(chainId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  })
    .then((res) => res.json())
    .then(async (response) => {
      res = response?.data?.petitions;
      if (response?.data?.petitions) {
        const idList: string[] = response.data.petitions.map((petition: IPetition) => petition.id);
        const lowerTierSignatures = await getSignaturesForPetitionsBatch(idList);
        res = response.data.petitions.map((petition: any, idx: number) => {
          return {
            id: petition.id,
            cid: petition.cid,
            petitioner: petition.petitioner,
            tier0Signatures: lowerTierSignatures?.data ? lowerTierSignatures.data[idx]?.tier0Count ?? 0 : 0,
            tier1Signatures: lowerTierSignatures?.data ? lowerTierSignatures.data[idx]?.tier1Count ?? 0 : 0,
            tier2Signatures: petition.signatures,
            timestamp: petition.timestamp
          };
        });
      }
    });

  return res ?? null;
};

export const getUserSignedPetition = async (
  chainId: string | number,
  id: string,
  account?: string
): Promise<boolean> => {
  if (!account) {
    return false;
  }

  let res: boolean = false;
  const query = `{
    petitionSigneds(where: {signer: "${account}", petitionUuid: "${id}"}) {
      id
    }
  }`;

  await fetch(`${GRAPHQL_URL(chainId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: query
    })
  })
    .then((res) => res.json())
    .then((response) => {
      res = response?.data?.petitionSigneds?.length > 0 ?? false;
    });

  return res;
};
