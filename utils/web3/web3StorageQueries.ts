import { ResponseObject } from "../../types";
// @ts-ignore
import { Web3File } from "web3.storage/dist/bundle.esm.min.js";

export const getObj = async (cid: string, roomId: string): Promise<ResponseObject<Web3File>> => {
  let res: any = {};
  await fetch(`https://w3s.link/ipfs/${cid}/${roomId}.json`, {
    method: "GET"
  })
    .then((res) => res.json())
    .then((result) => (res = result))
    .catch((err) => (res = { success: false, errorMsg: err.toString() }));

  return { success: true, errorMsg: "ok", data: res };
};
