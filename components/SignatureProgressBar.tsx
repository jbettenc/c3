import { useEffect, useState } from "react";

interface SignatureProgressBarProps {
  signatures: number;
  color?: string;
  showPercent?: boolean;
  showCount?: boolean;
  customCountStyle?: string;
}

export const GOAL_STEPS = [
  10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 500000, 1000000, 2000000, 5000000
];

function SignatureProgressBar(props: SignatureProgressBarProps) {
  const { signatures = 0, color = "bg-orange-600", showPercent = false, showCount = false, customCountStyle } = props;
  const [goal, handleGoal] = useState(5000000);

  useEffect(() => {
    for (const val of GOAL_STEPS) {
      if (val > signatures) {
        console.log(signatures ?? 0);
        handleGoal(val);
        console.log(val);
        console.log((signatures ?? 0) / val);
        break;
      }
    }
  }, [signatures]);

  return (
    <>
      <div className="my-auto mr-2 w-full bg-gray-200 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${((signatures ?? 0) / goal) * 100}%` }}></div>
      </div>
      {showPercent ? (
        <div className="whitespace-nowrap font-medium">{Math.floor(((signatures ?? 0) / goal) * 100)}%</div>
      ) : null}
      {showCount ? (
        <div className={`${customCountStyle ? customCountStyle : "whitespace-nowrap font-medium"}`}>
          {signatures ?? 0}/{goal} Signatures
        </div>
      ) : null}
    </>
  );
}

export default SignatureProgressBar;
