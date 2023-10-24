import { useState, useEffect } from "react";
import { IPetition } from "@/types";
import Signer from "./Signer";
import Pagination from "@/ui/pagination/Pagination";
import SignatureProgressBar, { GOAL_STEPS } from "./SignatureProgressBar";

interface SignerCardProps {
  petition?: IPetition;
  signers?: any;
}

function SignerCard(props: SignerCardProps) {
  const SIGNERS_PER_PAGE = 8;
  const { petition, signers } = props;

  const [currentPage, handleCurrentPage] = useState<number>(0);
  const [goal, handleGoal] = useState(5000000);

  useEffect(() => {
    if (!petition) {
      handleGoal(5000000);
      return;
    }
    const signatures =
      (petition.tier0Signatures ?? 0) + (petition.tier1Signatures ?? 0) + (petition.tier2Signatures ?? 0);
    for (const val of GOAL_STEPS) {
      if (val > signatures) {
        handleGoal(val);
        break;
      }
    }
  }, [petition]);

  return (
    <>
      <div className="w-full flex flex-col gap-4 border border-gray-200 rounded-md py-4">
        <div className="flex px-4">
          <div className="font-lg font-semibold mr-2">Signers</div>
          <div className="font-medium bg-orange-50 text-orange-700 rounded-full px-3 text-sm my-auto">
            {(petition?.tier2Signatures ?? 0) + (petition?.tier1Signatures ?? 0) + (petition?.tier0Signatures ?? 0)}/
            {goal} signatures
          </div>
        </div>
        <div className="flex px-4">
          <SignatureProgressBar
            tier0Signatures={petition?.tier0Signatures ?? 0}
            tier1Signatures={petition?.tier1Signatures ?? 0}
            tier2Signatures={petition?.tier2Signatures ?? 0}
            showPercent
          />
        </div>
        <table>
          <thead>
            <tr className="bg-gray-50 text-gray-500 border-b border-t border-gray-300">
              <th className="py-3 pl-4">
                <div className="text-left font-medium">Name</div>
              </th>
              <th className="py-3 pr-4">
                <div className="text-left font-medium">Sign Date</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {signers
              ? signers
                  .slice(SIGNERS_PER_PAGE * currentPage, SIGNERS_PER_PAGE * (1 + currentPage))
                  .map((signer: any, idx: number) => (
                    <tr key={`signer-${currentPage}-${idx}`} className="border-b border-gray-300">
                      <td className="pl-4 py-2">
                        <Signer address={signer.conduit} verificationType={2} />
                      </td>
                      <td className="pr-4 py-2">{new Date(signer.timestamp * 1000).toLocaleDateString()}</td>
                    </tr>
                  ))
              : null}
          </tbody>
        </table>
        <Pagination
          total={Math.max(Math.floor((signers?.length ?? 0) / SIGNERS_PER_PAGE), 1)}
          currentPage={currentPage}
          handleCurrentPage={handleCurrentPage}
        />
      </div>
    </>
  );
}

export default SignerCard;
