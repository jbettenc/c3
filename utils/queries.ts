import { GRAPHQL_URL } from "@/constants/constants";
import { IPetition } from "@/types";
import { getPetitionOffChain, getSignaturesForPetition } from "./storage";
import { ReportCategory } from "@/components/modals/ReportPetition";
import { splitPetitionId } from "./misc";

const loadPetitionOnChain = async (chainId: string | number, id: string) => {
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
          timestamp: response.data.petition.timestamp,
          reportCount: 0,
          reportMostFrequentCategory: { category: ReportCategory.OTHER, count: 0 },
          localUpdate: false
        };
      }
    });
  return res ?? null;
};

const loadPetitionOffChain = async (chainId: string | number, prefix: string, id: string) => {
  let res: IPetition | null = null;
  let tier2Signatures = 0;
  const petitionData = await getPetitionOffChain(prefix, id);
  if (!petitionData?.data) {
    return res;
  }

  const query = `{
        petition(id: "${prefix}${id}") {
            signatures
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
    .then((res) => res.clone().json())
    .then((response) => {
      if (response?.data?.petition) {
        tier2Signatures = response.data.petition.signatures;
      }
    });

  res = {
    id: petitionData.data.id,
    cid: petitionData.data.cid,
    petitioner: petitionData.data.petitioner,
    tier0Signatures: petitionData.data.tier0Signatures,
    tier1Signatures: petitionData.data.tier1Signatures,
    tier2Signatures,
    timestamp: petitionData.data.createdAt,
    reportCount: petitionData.data.reportCount,
    reportMostFrequentCategory: petitionData.data.reportMostFrequentCategory,
    localUpdate: false
  };

  return res ?? null;
};

export const loadPetition = async (chainId: string | number, idCombined: string): Promise<IPetition | null> => {
  const { prefix, id } = splitPetitionId(idCombined);
  if (prefix === "") {
    return await loadPetitionOnChain(chainId, id);
  } else {
    return await loadPetitionOffChain(chainId, prefix, id);
  }
};

export const loadPetitionSigners = async (chainId: string | number, id: string) => {
  let res: any = null;

  // Fetch tier 2 signers
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
      res = response?.data?.petitionSigneds.map((signer: any) => Object.assign(signer, { type: 2 }));
    });

  // Fetch remaining signers
  const lowerTierSigners = await getSignaturesForPetition(id, 0);
  if (lowerTierSigners?.data) {
    res = res.concat(
      (lowerTierSigners.data as any[])
        .filter((vote: any) => !!vote.address)
        .map((vote: any) => {
          return {
            petitionUuid: id,
            conduit: vote.address.toLowerCase(),
            type: vote.type,
            timestamp: Math.floor(new Date(vote.createdAt).getTime() / 1000)
          };
        })
    );
  }

  return res ?? null;
};

export const getPetitions = async (
  chainId: string | number,
  ids: string[]
): Promise<{ [key: string]: IPetition } | null> => {
  let res: any = null;
  const query = `{
    ${ids.map(
      (id: string, idx) =>
        `s${idx}: petition(id: "${id}") {
        id
        petitioner
        signatures
        cid
        timestamp
      }`
    )}
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
      res = response?.data;
      if (response?.data) {
        res = {};
        for (const key of Object.keys(response.data)) {
          const id = response.data[key]?.id ?? null;
          if (id !== null) {
            res[id] = response.data[key]
              ? {
                  id: response.data[key].id,
                  cid: response.data[key].cid,
                  petitioner: response.data[key].petitioner,
                  tier2Signatures: response.data[key].signatures,
                  timestamp: response.data[key].timestamp
                }
              : {
                  id: "",
                  cid: "",
                  petitioner: "",
                  tier2Signatures: 0,
                  timestamp: ""
                };
          }
        }
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
