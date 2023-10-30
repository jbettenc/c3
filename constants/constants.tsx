// @param production
// false: Testnet support for Goerli + testnet endpoints and testnet contract addresses.
// true: Mainnet support ONLY. Use real endpoints and real contract addresses.
const production = process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false;

const CONTRACT_ADDRESS_MAINNET = "0x176Fd7d61942F5166bdCa1751fC0242FC950A4C0";
const CONTRACT_ADDRESS_POLYGON = "0x759ac3CA33FeeAfB8C41aEbC8687A7Bd849Fc87a";
const CONTRACT_ADDRESS_POLYGON_MUMBAI = "0x8D92827CdB67A503e9FB21B28a58F9dAb36B4973";
const CONTRACT_ADDRESS_TESTNET = "0x36e3f7a8C88EE63740b50f7b87c069a74e461f85";
const GRAPHQL_URL_MAINNET = "https://api.studio.thegraph.com/query/33336/deal-mainnet/v0.1.9.2";
const GRAPHQL_URL_POLYGON = "https://api.studio.thegraph.com/query/49892/c3-polygon/v0.0.1";
const GRAPHQL_URL_POLYGON_MUMBAI = "https://api.studio.thegraph.com/query/49892/c3-mumbai/v0.0.4";
// const GRAPHQL_URL_MAINNET = "https://api.studio.thegraph.com/query/33336/deal-mainnet-staging/v0.1.9.2";
const GRAPHQL_URL_TESTNET = "https://api.studio.thegraph.com/query/49892/c3-base-goerli/v0.1.6";

export const INJECTED_SUPPORTED_CHAIN_IDS = production ? [1, 137] : [1, 5, 137, 80001, 84531];

export const ETHSIGN_API_URL = "https://arweave-gateway.ethsign.xyz";
export const PETITION_API_URL = "https://c3-backend-7yra2rrcpa-wn.a.run.app";

export const DEFAULT_CHAIN_ID = 80001;

export const CONTRACT_ADDRESS = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return CONTRACT_ADDRESS_MAINNET;
    case "137":
    case 137:
      return CONTRACT_ADDRESS_POLYGON;
    case "80001":
    case 80001:
      return CONTRACT_ADDRESS_POLYGON_MUMBAI;
    case "84531":
    case 84531:
      return CONTRACT_ADDRESS_TESTNET;
  }
  return production ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET;
};

export const GRAPHQL_URL = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return GRAPHQL_URL_MAINNET;
    case "137":
    case 137:
      return GRAPHQL_URL_POLYGON;
    case "80001":
    case 80001:
      return GRAPHQL_URL_POLYGON_MUMBAI;
    case "84531":
    case 84531:
      return GRAPHQL_URL_TESTNET;
  }
  return production ? GRAPHQL_URL_MAINNET : GRAPHQL_URL_TESTNET;
};

export {};
