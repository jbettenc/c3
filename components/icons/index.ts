import { SVGProps } from "react";

export * from "./MetaMaskIcon";
export * from "./CoinbaseIcon";
export * from "./imTokenLogoIcon";
export * from "./WalletConnectIcon";
export * from "./Web3DefaultLogoIcon";
export * from "./GoogleIcon";
export * from "./WalletIcon";
export * from "./DiscordIcon";
export * from "./TwitterIcon";

export enum Status {
  READY = "ready",
  IN_PROGRESS = "in_progress",
  DONE = "done"
}

export interface IconProps extends SVGProps<SVGSVGElement> {
  status?: Status;
  width?: number;
  height?: number;
}
