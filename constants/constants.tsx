// @param production
// false: Testnet support for Goerli + testnet endpoints and testnet contract addresses.
// true: Mainnet support ONLY. Use real endpoints and real contract addresses.
const production = process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false;

const CONTRACT_ADDRESS_OPTIMISM = "0x4e4af2a21ebf62850fD99Eb6253E1eFBb56098cD";
const CONTRACT_ADDRESS_POLYGON_MUMBAI = "0x8D92827CdB67A503e9FB21B28a58F9dAb36B4973";
const GRAPHQL_URL_OPTIMISM = "https://subgraph.satsuma-prod.com/team-ethsign--23914/c3-op/version/v0.0.6/api";
const GRAPHQL_URL_POLYGON_MUMBAI =
  "https://subgraph.satsuma-prod.com/746168fe5a7e/team-ethsign--23914/c3-mumbai/version/v0.0.5/api";

export const INJECTED_SUPPORTED_CHAIN_IDS = production ? [1, 137] : [1, 5, 137, 80001, 84531];

export const ETHSIGN_API_URL = "https://arweave-gateway.ethsign.xyz";
export const PETITION_API_URL = "https://c3-backend-7yra2rrcpa-wn.a.run.app";

export const DEFAULT_CHAIN_ID = 10;

export const CONTRACT_ADDRESS = (chainId: string | number) => {
  switch (chainId) {
    case "10":
    case 10:
      return CONTRACT_ADDRESS_OPTIMISM;
    case "80001":
    case 80001:
      return CONTRACT_ADDRESS_POLYGON_MUMBAI;
  }
  return production ? CONTRACT_ADDRESS_OPTIMISM : CONTRACT_ADDRESS_POLYGON_MUMBAI;
};

export const GRAPHQL_URL = (chainId: string | number) => {
  switch (chainId) {
    case "10":
    case 10:
      return GRAPHQL_URL_OPTIMISM;
    case "80001":
    case 80001:
      return GRAPHQL_URL_POLYGON_MUMBAI;
  }
  return production ? GRAPHQL_URL_OPTIMISM : GRAPHQL_URL_POLYGON_MUMBAI;
};

export {};
