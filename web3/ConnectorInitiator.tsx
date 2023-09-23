import { useEagerConnect } from "@/utils/hooks/useEagerConnect";
import { useInactiveListener } from "@/utils/hooks/useInactiveListener";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

function ConnectorInitiator(props: any) {
  const [activatingConnector, setActivatingConnector] = useState();

  const { connector } = useWeb3React();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // handle logic to recognize the connector currently being activated
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  return props.children;
}

export default ConnectorInitiator;
