import TooltipWrapper from "@/ui/TooltipWrapper";
import { useEffect, useState } from "react";

interface SignatureProgressBarProps {
  tier0Signatures: number;
  tier1Signatures: number;
  tier2Signatures: number;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  showPercent?: boolean;
  showCount?: boolean;
  customCountStyle?: string;
}

export const GOAL_STEPS = [
  10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 500000, 1000000, 2000000, 5000000
];

function SignatureProgressBar(props: SignatureProgressBarProps) {
  const {
    tier0Signatures = 0,
    tier1Signatures = 0,
    tier2Signatures = 0,
    primaryColor = "bg-primary-700",
    secondaryColor = "bg-primary-500",
    tertiaryColor = "bg-primary-300",
    showPercent = false,
    showCount = false,
    customCountStyle
  } = props;
  const [goal, handleGoal] = useState(5000000);

  useEffect(() => {
    const signatures = tier0Signatures + tier1Signatures + tier2Signatures;
    for (const val of GOAL_STEPS) {
      if (val > signatures) {
        handleGoal(val);
        break;
      }
    }
  }, [tier0Signatures, tier1Signatures, tier2Signatures]);

  return (
    <>
      <TooltipWrapper
        className="w-full my-auto mr-2"
        size="lg"
        text={`${tier2Signatures} Orb Verified Signature${
          tier2Signatures !== 1 ? "s" : ""
        } / ${tier1Signatures} Phone Verified Signature${
          tier1Signatures !== 1 ? "s" : ""
        } / ${tier0Signatures} Visitor${tier0Signatures !== 1 ? "s" : ""}`}
      >
        <div className="relative bg-gray-200 rounded-full h-2.5">
          <div
            className={`${tertiaryColor} h-2.5 rounded-full absolute`}
            style={{
              width: `${(((tier2Signatures ?? 0) + (tier1Signatures ?? 0) + (tier0Signatures ?? 0)) / goal) * 100}%`
            }}
          ></div>
          <div
            className={`${secondaryColor} h-2.5 rounded-full absolute`}
            style={{ width: `${(((tier2Signatures ?? 0) + (tier1Signatures ?? 0)) / goal) * 100}%` }}
          ></div>
          <div
            className={`${primaryColor} h-2.5 rounded-full absolute`}
            style={{ width: `${((tier2Signatures ?? 0) / goal) * 100}%` }}
          ></div>
        </div>
      </TooltipWrapper>

      {showPercent ? (
        <div className="whitespace-nowrap font-medium">
          {Math.floor((((tier2Signatures ?? 0) + (tier1Signatures ?? 0) + (tier0Signatures ?? 0)) / goal) * 100)}%
        </div>
      ) : null}
      {showCount ? (
        <div className={`${customCountStyle ? customCountStyle : "whitespace-nowrap font-medium"}`}>
          {(tier2Signatures ?? 0) + (tier1Signatures ?? 0) + (tier0Signatures ?? 0)}/{goal} Signatures
        </div>
      ) : null}
    </>
  );
}

export default SignatureProgressBar;
