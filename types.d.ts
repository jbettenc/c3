import { SVGProps } from "react";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { TorusConnector } from "@web3-react/torus-connector";

export interface Provider {
  id: string;
  name: string;
  type: "injected" | "torus" | "walletConnect" | "walletLink";
  description?: string;
  connector: AbstractConnector | TorusConnector;
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
