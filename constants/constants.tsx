// @param production
// false: Testnet support for Goerli + testnet endpoints and testnet contract addresses.

import { VerificationLevel } from "@worldcoin/idkit";

// true: Mainnet support ONLY. Use real endpoints and real contract addresses.
const production = process.env.NEXT_PUBLIC_SENTRY_DSN ? true : false;

const CONTRACT_ADDRESS_OPTIMISM = "0x72efA4093539A909C1f9bcCA1aE6bcDa435a3433";
const CONTRACT_ADDRESS_POLYGON_MUMBAI = "0xc2b2e1175017114C0bAf4559362B81C2332f85fD";
const GRAPHQL_URL_OPTIMISM =
  "https://subgraph.satsuma-prod.com/746168fe5a7e/team-ethsign--23914/c3-op/version/v0.0.9/api";
const GRAPHQL_URL_POLYGON_MUMBAI =
  "https://subgraph.satsuma-prod.com/746168fe5a7e/team-ethsign--23914/c3-mumbai/version/v0.0.9/api";

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

export const WORLDCOIN_APP_ID = (chainId: string | number, verificationLevel: VerificationLevel) => {
  switch (chainId) {
    case "10":
    case 10:
      switch (verificationLevel) {
        case VerificationLevel.Orb:
          return "app_7f9557d75a9989cc762d18a645cb2c1c";
        case VerificationLevel.Device:
          return "app_b7d787f43d70812fa623356b8f4bb1c6";
        default:
          return "app_7f9557d75a9989cc762d18a645cb2c1c";
      }
    case "80001":
    case 80001:
      switch (verificationLevel) {
        case VerificationLevel.Orb:
          return "app_staging_6ec3ea829a0d16fa66a44e9872b70153";
        case VerificationLevel.Device:
          return "app_staging_0ff1142a912bb109636e597b70d6b978";
        default:
          return "app_staging_6ec3ea829a0d16fa66a44e9872b70153";
      }
    default:
      return "app_7f9557d75a9989cc762d18a645cb2c1c";
  }
};

export {};
