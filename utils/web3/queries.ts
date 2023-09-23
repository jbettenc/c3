import { ethers } from "ethers";
import _ from "lodash";
import { CollectionMetadata, NFTCollection, NFTMetadata, Token } from "../../types";
import { chainIdToMoralisChainString, validateIpfsUrl } from "../misc";

const MORALIS_API_KEY = "o7le31ZbMklNrBnkjRZAqU9PbLF2vtAYqFFqiPGzSxPuBS0SuQWKIdrRbD5Qd0MY";

const API_URL = "https://api.deal.art";

interface DuneObject {
  contractAddress: string;
  tokenId: string;
  tokenAmount?: string;
}

export async function getUserNFTs(address: string, chainId: string | number) {
  let nftMetadata: NFTMetadata[] = [];

  try {
    await fetch(`${API_URL}/cache/nft/collections/owner/${chainId}/${address}`, {
      method: "GET",
      headers: {
        accept: "application/json"
      }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data) {
          nftMetadata = result.data;
        }
      });
  } catch (err) {
    console.log(err);
  }

  return nftMetadata;
}

export async function getEthBalance(account: string): Promise<Token> {
  const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/xTrIufa8bBMhQmEc14yrjDOV0yKIka9r`);
  const balance = await provider.getBalance(account);

  return {
    balance: balance.toString(),
    decimals: 18,
    logo: `/assets/eth_logo.svg`,
    name: "Ether",
    symbol: "ETH",
    thumbnail: null,
    token_address: ""
  };
}

export async function getUserTokens(account: string, chainId: string | number) {
  let ret: any[] = [];
  await fetch(`https://deep-index.moralis.io/api/v2/${account}/erc20?chain=${chainIdToMoralisChainString(chainId)}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": MORALIS_API_KEY
    }
  })
    .then((res) => res.json())
    .then((response) => {
      ret = response;
    });

  if (chainId === "1" || chainId === 1) {
    const ethBal = await getEthBalance(account);
    if (BigInt(ethBal.balance) > BigInt(0)) {
      ret.push(ethBal);
    }
  }

  return ret;
}

export async function getCollections(search: string, chainId: string | number, limit = 10, signal: AbortSignal) {
  const cols: NFTCollection[] = [];
  await fetch(`${API_URL}/cache/nft/collections/search/${chainId}?searchQuery=${search}&searchExternal=true`, {
    method: "get",
    signal: signal,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json"
    }
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.data) {
        for (const col of response.data) {
          cols.push({
            metadata: col,
            nfts: [
              {
                tokenId: "",
                name: col.name ?? "",
                description: col.description ?? "",
                image: validateIpfsUrl(col.image ?? "")
              }
            ],
            selected: false
          });
        }
      }
    });
  return cols;
}

export async function getCollection(address: string, chainId: string | number, signal?: AbortSignal) {
  let col: NFTCollection = { selected: false, nfts: [] };

  try {
    await fetch(`${API_URL}/cache/nft/collections/get-batch/${chainId}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify([{ contractAddress: address }])
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.data && response.data.length) {
          col.metadata = response.data[0] as CollectionMetadata;
          col.metadata.image = validateIpfsUrl(col.metadata.image ?? "");
          col.nfts = [
            {
              collection: response.data[0] as CollectionMetadata,
              tokenId: ethers.MaxUint256.toString(),
              name: response.data.name,
              description: response.data.description,
              image: validateIpfsUrl(response.data.image ?? "")
            }
          ];
        }
      });
  } catch (error) {
    console.error(error);
  }

  return col;
}

export async function getCollectionsByAddress(address: string, chainId: string | number, signal: AbortSignal) {
  return [await getCollection(address, chainId, signal)];
}

export function groupNftsByCollection(nfts: NFTMetadata[]): NFTCollection[] {
  const obj: Record<string, NFTCollection> = {};

  for (const nft of nfts) {
    if (!obj[nft.collection?.address ?? ""]) {
      obj[nft.collection?.address ?? ""] = {
        metadata: Object.assign({}, nft.collection),
        selected: false,
        nfts: [nft]
      };
    } else {
      obj[nft.collection?.address ?? ""].nfts.push(nft);
    }
  }

  const ret: NFTCollection[] = [];
  for (const key of Object.keys(obj)) {
    ret.push(obj[key]);
  }

  return ret;
}

export async function getCollectionsFromNfts(nfts: NFTMetadata[], chainId: string | number) {
  let nftCollectionEntity: NFTCollection[] = [];
  try {
    await fetch(`${API_URL}/cache/nft/collections/get-batch/${chainId}`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        nfts.map((nft) => {
          return { contractAddress: nft?.collection?.address };
        })
      )
    })
      .then((res) => res.json())
      .then((response) => {
        if (response?.data && response.data.length) {
          nftCollectionEntity = response.data.map((collection: CollectionMetadata) => ({
            metadata: collection
          }));
        }
      });
  } catch (error) {
    console.error(error);
  }

  return nftCollectionEntity;
}

export async function getErc20TokenMetadata(contractAddresses: string[], chainId: string): Promise<Token[]> {
  let ret: Token[] = [];
  if (contractAddresses.length > 0) {
    try {
      await fetch(
        `https://deep-index.moralis.io/api/v2/erc20/metadata${contractAddresses.map(
          (address) => `?addresses=${address}`
        )}&chain=${chainIdToMoralisChainString(chainId)}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "X-API-Key": MORALIS_API_KEY
          }
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result && result[0]) {
            ret = result;
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  return ret;
}

export async function getNFTMetadata(nfts: DuneObject[], chainId: string | number, notificationAdd?: any) {
  const nftMetadata: NFTMetadata[] = [];
  const cols = nfts.filter((nft) => BigInt(nft.tokenId.toString()) === ethers.MaxUint256);
  let tmpNfts = nfts.filter((nft) => BigInt(nft.tokenId.toString()) !== ethers.MaxUint256);

  // Explicitly grab metadata for collections
  for (const col of cols) {
    // Should load collection info and create collection entry
    nftMetadata.push((await getCollection(col.contractAddress, chainId)).nfts[0]);
  }

  if (tmpNfts.length > 0) {
    try {
      await fetch(`${API_URL}/cache/nft/get-batch/${chainId}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tmpNfts)
      })
        .then((res) => res.json())
        .then(async (response) => {
          if (response.data) {
            try {
              for (const nft of response.data) {
                if (nft.collection) {
                  nft.collection.image = validateIpfsUrl(nft.collection.image ?? "");
                }
                nft.image = validateIpfsUrl(nft.image ?? "");
                nftMetadata.push(nft);
              }
            } catch (e) {
              console.log(e);
              throw new Error(response.statusText);
            }
          }
        });
    } catch (error: any) {
      if (notificationAdd) {
        notificationAdd("ERROR", error.message);
      }
    }
  }

  return nftMetadata;
}

export async function getCollectionNfts(contractAddress: string, chainId: string | number, pageSize = 100) {
  let nftMetadata: NFTMetadata[] = [];
  await fetch(`${API_URL}/cache/nft/collections/assets/${chainId}/${contractAddress}?limit=${pageSize}`, {
    method: "GET",
    headers: {
      accept: "application/json"
    }
  })
    .then((res) => res.json())
    .then((response) => {
      if (response?.data) {
        for (const nft of response.data) {
          if (nft.collection) {
            nft.collection.image = validateIpfsUrl(nft.collection.image ?? "");
          }
          nft.image = validateIpfsUrl(nft.image ?? "");
          nftMetadata.push(nft);
        }
      }
    });

  return nftMetadata;
}
