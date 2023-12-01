import { useWeb3React } from "@web3-react/core";

import Identicon from "../common/IdentIcon";
import { useDispatch, useSelector } from "react-redux";
import { setLoginType, setOpenLoginModal } from "../../store/userSlice";
import { WalletIcon } from "../icons/WalletIcon";
import { useRouter } from "next/router";
import Image from "next/image";
import { LogoutIcon } from "../icons/LogoutIcon";
import { OpenWalletIcon } from "../icons/OpenWalletIcon";
import { DollarIcon } from "../icons/DollarIcon";
import Dropdown from "@/ui/dropdown/Dropdown";
import Button from "@/ui/forms/Button";
import { AccountData } from "@/types";
import UserDisplay from "../UserDisplay";
import { RootState } from "@/store/root";
import { useENS } from "@/utils/hooks/useENS";

function DropdownUser() {
  const { isActive, account, connector } = useWeb3React();
  const dispatch = useDispatch();
  const router = useRouter();
  const { alias, avatar } = useENS(account ?? "");

  if (!isActive) {
    return (
      <>
        <Button
          style="secondary"
          className="hidden md:flex w-full whitespace-nowrap"
          icon={<WalletIcon />}
          onClick={() => dispatch(setOpenLoginModal(true))}
        >
          Connect Wallet
        </Button>
        <Button
          style="secondary"
          className="block md:hidden w-full font-bold whitespace-nowrap"
          rounded={true}
          customFont={true}
          icon={<WalletIcon />}
          onClick={() => dispatch(setOpenLoginModal(true))}
        ></Button>
      </>
    );
  }

  return (
    <Dropdown
      align="right"
      handleOpenChanged={() => {
        // TODO: Implement this as needed
      }}
      button={
        <>
          <div id="account-button">
            <Button
              style="secondary"
              className="w-full font-bold py-2 px-4 whitespace-nowrap border"
              stopPropagation={false}
              customSizing={true}
              shadow={false}
              icon={
                avatar ? (
                  <Image className="w-9 h-9 rounded-full object-cover" src={avatar} alt="" />
                ) : (
                  <div className="py-1 pr-1">
                    <Identicon
                      string={account ? account.toLowerCase() : ""}
                      size={17}
                      palette={["#FFC32A", "#AEDFFB", "#6C66E9", "#FFDB80", "#CDCDCD", "#000000", "#C9AEFB", "#B9E5D4"]}
                    />
                  </div>
                )
              }
            >
              <>
                {alias ? alias : !!account && account.slice(0, 10) + "..."}
                <span className="ml-2 mt-px">
                  <svg width="10" height="100%" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 9L0.0717975 3.51391e-07L13.9282 -8.59975e-07L7 9Z" fill="black" />
                  </svg>
                </span>
              </>
            </Button>
          </div>
        </>
      }
      dropdownChildren={() => (
        <>
          <div className="px-4 flex items-center justify-start w-max text-black">
            <div className="identicon cursor-pointer border-2 hover:bg-gray-50 active:bg-white mr-4 flex rounded-full">
              {avatar ? (
                <Image className="w-9 h-9 rounded-full object-cover" src={avatar} alt="" />
              ) : (
                <div className="p-2">
                  <Identicon
                    string={account ? account.toLowerCase() : ""}
                    size={17}
                    palette={["#FFC32A", "#AEDFFB", "#6C66E9", "#FFDB80", "#CDCDCD", "#000000", "#C9AEFB", "#B9E5D4"]}
                  />
                </div>
              )}
            </div>
            <UserDisplay accountData={{ ethAvatar: avatar, ethAlias: alias }} />
          </div>

          <div className="h-px bg-gray-300"></div>

          {/* <div
            className={`justify-start px-6 flex cursor-pointer mx-auto py-4 bg-white hover:bg-gray-50 active:bg-white rounded-b-md`}
            role="menuitem"
            tabIndex={-1}
            onClick={async (e: any) => {
              e.preventDefault();
              router.push("/profile");
            }}
          >
            <div className="flex-col justify-start mr-4 my-auto">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM6 20C5.45 20 4.97933 19.8043 4.588 19.413C4.196 19.021 4 18.55 4 18V17.2C4 16.6333 4.146 16.1123 4.438 15.637C4.72933 15.1623 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6457 8.75 13.387C9.81667 13.129 10.9 13 12 13C13.1 13 14.1833 13.129 15.25 13.387C16.3167 13.6457 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2707 15.1623 19.562 15.637C19.854 16.1123 20 16.6333 20 17.2V18C20 18.55 19.8043 19.021 19.413 19.413C19.021 19.8043 18.55 20 18 20H6Z"
                  fill="black"
                />
              </svg>
            </div>
            <div className="text-black">My Profile</div>
          </div> */}

          <div
            className={`justify-start px-6 flex cursor-pointer mx-auto py-4 bg-white hover:bg-gray-50 active:bg-white rounded-b-md`}
            role="menuitem"
            tabIndex={-1}
            onClick={async (e: any) => {
              e.preventDefault();
              e.stopPropagation();
              if (connector?.deactivate) {
                connector.deactivate();
              } else {
                connector.resetState();
              }
              dispatch(setLoginType(undefined));
            }}
          >
            <div className="flex-col justify-start mr-4 my-auto">
              <LogoutIcon className="fill-black w-[24px] h-auto" />
            </div>
            <div className="text-black">Log Out</div>
          </div>
        </>
      )}
    />
  );
}

export default DropdownUser;
