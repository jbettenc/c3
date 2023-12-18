import { SVGProps } from "react";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { ReportCategory, ReportReason } from "./components/modals/ReportPetition";

export interface Provider {
  id: string;
  name: string;
  type: "metaMask" | "walletConnect" | "coinbaseWallet";
  description?: string;
  connector: MetaMask | WalletConnectV2 | CoinbaseWallet;
  logos?: ((props: SVGProps<SVGSVGElement>) => JSX.Element)[];
  check: string;
}

interface AccountData {
  ethAvatar?: string | null;
  ethAlias?: string | null;
}

interface ResponseObject<T> {
  success: boolean;
  errorMsg?: string;
  data?: T;
}

export type StoragePayload = {
  signature: string;
  message: string;
  data: string;
  tags: { name: string; value: string }[];
  shouldVerify?: boolean;
  timestamp?: string;
};

export type StorageResponse = {
  input?: unknown;
  message: string;
  transaction: {
    message?: string;
    itemId?: string;
  };
};

export interface IPetition {
  id: string;
  cid: string;
  petitioner: string;
  tier2Signatures: number;
  tier0Signatures?: number;
  tier1Signatures?: number;
  reportCount: number;
  reportMostFrequentCategory: { category: ReportCategory; count: number };
  timestamp: string;
  localUpdate: boolean;
}

export interface IPetitionMetadata {
  address: string;
  title: string;
  description: string;
  thumbnails: string[];
  images: string[];
}

export type ArweavePayload = {
  [key: string]: any;
};

export type PetitionReport = {
  createdAt: string;
  updatedAt: string;
  id: string;
  category: ReportCategory;
  petitionId: string;
  address: string;
  message?: string;
  signature: string;
};
