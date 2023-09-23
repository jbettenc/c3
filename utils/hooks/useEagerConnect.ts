import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";

import { injected, torus, walletConnect, walletLink } from "../web3/connectors";
import { RootState } from "../../store/root";

export function useEagerConnect(): boolean {
  const { activate, active } = useWeb3React();
  const loginType = useSelector((state: RootState) => state.user.loginType);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (loginType === "injected") {
      injected
        .isAuthorized()
        .then((isAuthorized) => {
          if (isAuthorized) {
            activate(injected, undefined, true).catch(() => {
              setTried(true);
            });
          }
        })
        .catch(() => {
          setTried(true);
        });
    } else if (loginType === "walletConnect") {
      activate(walletConnect, undefined, true).catch(() => {
        setTried(true);
      });
    } else if (loginType === "walletLink") {
      activate(walletLink, undefined, true).catch(() => {
        setTried(true);
      });
    } else if (loginType) {
      activate(torus, undefined, true).catch(() => {
        setTried(true);
      });
    }
  }, [activate, loginType]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
