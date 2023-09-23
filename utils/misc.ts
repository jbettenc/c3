import { ethers } from "ethers";
import _ from "lodash";
import { NOTIFICATION_TYPE, Store } from "react-notifications-component";

export function range(n: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
  return ((n - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export function truncate(fullStr: string, frontChars: number, backChars: number, separator: string): string {
  frontChars = frontChars || 5;
  backChars = backChars || 3;
  separator = separator || "...";

  if (fullStr.length <= frontChars + backChars) return fullStr;

  return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
}

export function stringEqualsIgnoreCase(a: string | null | undefined, b: string | null | undefined): boolean {
  return typeof a === "string" && typeof b === "string"
    ? a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0
    : a === b;
}

export function scrollIntoViewIfNeeded(target: HTMLElement | null): void {
  if (!target) {
    return;
  }

  if (target.getBoundingClientRect().bottom > window.innerHeight) {
    target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  if (target.getBoundingClientRect().top < 0) {
    target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }
}

export function countDecimals(num: number): string | number {
  if (Math.floor(num.valueOf()) === num.valueOf()) return 0;

  const str = num.toString();
  if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
    return str.split("-")[1] || 0;
  } else if (str.indexOf(".") !== -1) {
    return str.split(".")[1].length || 0;
  }
  return str.split("-")[1] || 0;
}

/**
 * Decimal adjustment of a number.
 *
 * @param {String}  type  The type of adjustment.
 * @param {Number}  value The number.
 * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
 * @returns {Number} The adjusted value.
 */
export function decimalAdjust(type: any, value: any, exp: any): any {
  // If the exp is undefined or zero...
  if (typeof exp === "undefined" || +exp === 0) {
    // @ts-ignore
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split("e");
  // @ts-ignore
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
}

export function getRandomId(length: number): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function guidGenerator() {
  const S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

export function copyStringToClipboard(str: string) {
  // Create new element
  const el = document.createElement("textarea");
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "");
  // @ts-ignore
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(el);
}

export const getTimestampDiffString = (timestamp: number) => {
  timestamp = timestamp * 1000; // Convert from seconds to milliseconds

  const diff = Date.now() - timestamp;

  if (diff < 60000) {
    return "less than a min. ago";
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} min. ago`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} hour${Math.floor(diff / 3600000) != 1 ? "s" : ""} ago`;
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)} day${Math.floor(diff / 86400000) != 1 ? "s" : ""} ago`;
  } else if (diff < 31556952000) {
    return `${Math.floor(diff / 604800000)} week${Math.floor(diff / 604800000) != 1 ? "s" : ""} ago`;
  } else {
    return `${Math.floor(diff / 31556952000)} year${Math.floor(diff / 31556952000) != 1 ? "s" : ""} ago`;
  }
};

export const removeNoScrollFromBody = () => {
  document.body.classList.remove("noscroll");
};

export const ensToTokenId = (ens: string) => {
  if (_.isEmpty(ens)) {
    return "";
  }

  if (ens.endsWith(".eth")) {
    ens = ens.substring(0, ens.length - 4);
  }

  const labelHash = ethers.keccak256(ethers.toUtf8Bytes(ens));
  const tokenId = BigInt(labelHash).toString();

  return tokenId;
};

export const removeUndefinedValues = (obj: any) => {
  return JSON.parse(
    JSON.stringify(obj, function (a, b) {
      if (!/^_/.test(a) && b === undefined) {
        return null;
      }
      return /^_/.test(a) && !b ? void 0 : b;
    }).replace(/null/g, "null")
  );
};

export const chainIdToMoralisChainString = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return "eth";
    case "137":
    case 137:
      return "polygon";
    default:
      return "eth";
  }
};

export const chainIdToUbiquityChainString = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return "ethereum";
    case "137":
    case 137:
      return "polygon";
    default:
      return "ethereum";
  }
};

export const chainIdToCenterDevChainString = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return "ethereum-mainnet";
    case "137":
    case 137:
      return "polygon-mainnet";
    default:
      return "ethereum-mainnet";
  }
};

export const chainIdToNFTScanUrl = (chainId: string | number) => {
  switch (chainId) {
    case "1":
    case 1:
      return "https://restapi.nftscan.com/api/v2";
    case "137":
    case 137:
      return "https://polygonapi.nftscan.com/api/v2";
    default:
      return "https://restapi.nftscan.com/api/v2";
  }
};

export function storeNotif(subject: string, message: string, type: NOTIFICATION_TYPE) {
  Store.addNotification({
    title: subject,
    message: message ? message : " ",
    type: type,
    insert: "top",
    container: "bottom-right",
    animationIn: ["animated", "fadeIn"],
    animationOut: ["animated", "fadeOut"],
    dismiss: {
      duration: 10000,
      onScreen: true,
      showIcon: true,
      click: false,
      touch: false
    }
  });
}
