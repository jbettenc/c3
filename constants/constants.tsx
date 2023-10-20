// @param production
// false: Testnet support for Goerli + testnet endpoints and testnet contract addresses.
// true: Mainnet support ONLY. Use real endpoints and real contract addresses.
const production = process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false;

const DEAL_CONTRACT_ADDRESS_MAINNET = "0x176Fd7d61942F5166bdCa1751fC0242FC950A4C0";
const DEAL_CONTRACT_ADDRESS_TESTNET = "0x9d2e62a7fc4dA18Be776defc3C11eDC7f8806ef7";
const GRAPHQL_URL_MAINNET = "https://api.studio.thegraph.com/query/33336/deal-mainnet/v0.1.9.2";
const GRAPHQL_URL_POLYGON = "https://api.thegraph.com/subgraphs/id/QmS1654F5sTcjrBPrt4St78PTLf1ynnnF5m1ruG4PyovqY";
// const GRAPHQL_URL_MAINNET = "https://api.studio.thegraph.com/query/33336/deal-mainnet-staging/v0.1.9.2";
const GRAPHQL_URL_TESTNET = "https://api.studio.thegraph.com/query/33336/deal-goerli/v0.1.9.2";

export const INJECTED_SUPPORTED_CHAIN_IDS = production ? [1, 137] : [1, 5, 137, 84531];
export const DEAL_CONTRACT_ADDRESS = production ? DEAL_CONTRACT_ADDRESS_MAINNET : DEAL_CONTRACT_ADDRESS_TESTNET;

export const ETHSIGN_API_URL = "https://arweave-gateway.ethsign.xyz";
export const ETHSIGN_PETITION_API_URL = "http://localhost:8000";

export const GRAPHQL_URL = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return GRAPHQL_URL_MAINNET;
    case "137":
    case 137:
      return GRAPHQL_URL_POLYGON;
    case "5":
    case 5:
      return GRAPHQL_URL_TESTNET;
  }
  return production ? GRAPHQL_URL_MAINNET : GRAPHQL_URL_TESTNET;
};

export {};
