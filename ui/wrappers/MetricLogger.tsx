import { useEffect } from "react";
import { useRouter } from "next/router";
import { logPageView } from "@/utils/storage";
import { useHistory } from "./HistoryWrapper";

interface MetricLoggerProps {
  children: JSX.Element | JSX.Element[];
}
function MetricLogger(props: MetricLoggerProps) {
  const router = useRouter();
  const { initialized, history } = useHistory();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (router?.asPath) {
      logPageView(router.asPath, history.length > 0 ? history[history.length - 1] : undefined);
    }
  }, [initialized, router.asPath, history]);

  return props.children;
}

export default MetricLogger;
