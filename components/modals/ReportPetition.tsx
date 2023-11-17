import { useState } from "react";
import Dropdown from "@/ui/dropdown/Dropdown";
import Button from "@/ui/forms/Button";
import Input from "@/ui/forms/Input";
import { useWeb3React } from "@web3-react/core";
import { reportPetition } from "@/utils/storage";

export enum ReportCategoryText {
  HATE_SPEECH = "Hate Speech",
  HARASSMENT = "Harassment",
  VIOLENCE = "Violence",
  FRAUD_SCAM = "Fraud/Scam",
  SOMETHING_ELSE = "Something Else"
}

export enum ReportCategory {
  HATE_SPEECH = "hate_speech",
  VIOLENCE = "violence",
  HARASSMENT = "harassment",
  FRAUD_SCAM = "fraud_scam",
  OTHER = "other"
}

interface ReportPetitionProps {
  petitionId: string;
}

function ReportPetition(props: ReportPetitionProps) {
  const { petitionId } = props;
  const [reportReason, handleReportReason] = useState<ReportCategoryText>();
  const [message, handleMessage] = useState<string>("");

  const { account, connector } = useWeb3React();

  return (
    <>
      <div className="flex flex-col px-6 pb-8">
        <div className="mt-2">Report reason:</div>
        <Dropdown
          align="left"
          button={
            <>
              <div id="account-button">
                <Button
                  style="secondary"
                  className="w-full font-bold py-2 px-4 whitespace-nowrap border"
                  stopPropagation={false}
                  customSizing={true}
                  shadow={false}
                >
                  <>
                    {reportReason ? reportReason : "Choose Reason"}
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
          dropdownChildren={(open, handleOpen) => (
            <>
              <div className="flex flex-col divide-y">
                {(Object.keys(ReportCategoryText) as Array<keyof typeof ReportCategoryText>).map((reason) => (
                  <div
                    key={`dropdown-reason-${reason}`}
                    className="px-2 py-1 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      handleOpen(false);
                      handleReportReason(ReportCategoryText[reason]);
                    }}
                  >
                    {ReportCategoryText[reason]}
                  </div>
                ))}
              </div>
            </>
          )}
        ></Dropdown>
        <div className="mt-4">
          Additional details {reportReason === ReportCategoryText.SOMETHING_ELSE ? "(required)" : "(optional)"}:
        </div>
        <Input
          multiline
          required={reportReason === ReportCategoryText.SOMETHING_ELSE}
          className="min-h-[10rem]"
          value={message}
          onChange={(e) => handleMessage(e.target.value)}
        />
        <div className="flex mt-4">
          <Button
            className="ml-auto"
            onClick={async () => {
              if (!reportReason || !connector?.provider || !account) {
                return;
              }

              // Convert to categories that the backend understands
              let r: ReportCategory;
              switch (reportReason) {
                case ReportCategoryText.HATE_SPEECH:
                  r = ReportCategory.HATE_SPEECH;
                case ReportCategoryText.HARASSMENT:
                  r = ReportCategory.HARASSMENT;
                case ReportCategoryText.FRAUD_SCAM:
                  r = ReportCategory.FRAUD_SCAM;
                case ReportCategoryText.VIOLENCE:
                  r = ReportCategory.VIOLENCE;
                case ReportCategoryText.SOMETHING_ELSE:
                  r = ReportCategory.OTHER;
              }

              const obj = {
                reason: r,
                message: message
              };

              const m = JSON.stringify(obj);

              const signature = (await connector.provider.request({
                method: "personal_sign",
                params: [m, account]
              })) as string;

              console.log(await reportPetition(petitionId, m, signature, account));
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}

export default ReportPetition;
